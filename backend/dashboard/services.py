from collections import defaultdict
from decimal import Decimal

import requests

from dashboard.models import ExchangeRate


FRANKFURTER_BASE = 'https://api.frankfurter.dev/v1'


class FrankfurterError(Exception):
    pass


def fetch_exchange_rates(base, symbols, start_date, end_date):
    symbol_list = [s.strip() for s in symbols.split(',')]

    cached = ExchangeRate.objects.filter(
        base_currency=base,
        target_currency__in=symbol_list,
        date__gte=start_date,
        date__lte=end_date,
    )

    # ECB doesn't publish weekend rates, so we can't predict exact row count.
    # If we have any cached data for each symbol, assume the range is complete.
    cached_symbols = set(cached.values_list('target_currency', flat=True).distinct())
    if cached_symbols >= set(symbol_list) and cached.exists():
        return _rows_to_response(cached)

    url = f'{FRANKFURTER_BASE}/{start_date}..{end_date}'
    try:
        resp = requests.get(url, params={'base': base, 'symbols': symbols}, timeout=10)
        resp.raise_for_status()
    except requests.ConnectionError:
        raise FrankfurterError('Could not connect to Frankfurter API')
    except requests.Timeout:
        raise FrankfurterError('Frankfurter API request timed out')
    except requests.HTTPError as e:
        raise FrankfurterError(f'Frankfurter API error: {e.response.status_code}')

    data = resp.json()
    rates_by_date = data.get('rates', {})

    for date_str, rates in rates_by_date.items():
        for currency, rate in rates.items():
            ExchangeRate.objects.update_or_create(
                date=date_str,
                base_currency=base,
                target_currency=currency,
                defaults={'rate': Decimal(str(rate))},
            )

    rows = ExchangeRate.objects.filter(
        base_currency=base,
        target_currency__in=symbol_list,
        date__gte=start_date,
        date__lte=end_date,
    ).order_by('date')

    return _rows_to_response(rows)


def _rows_to_response(rows):
    grouped = defaultdict(lambda: {'rates': {}})
    for row in rows:
        key = str(row.date)
        grouped[key]['date'] = str(row.date)
        grouped[key]['base'] = row.base_currency
        grouped[key]['rates'][row.target_currency] = float(row.rate)

    return [grouped[k] for k in sorted(grouped.keys())]
