from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from dashboard.models import ExchangeRate


class RatesEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_missing_dates_returns_400(self):
        resp = self.client.get('/api/rates/', {'base': 'EUR', 'symbols': 'USD'})
        self.assertEqual(resp.status_code, 400)
        self.assertIn('start_date', resp.json()['error'])

    def test_date_range_over_two_years_returns_400(self):
        resp = self.client.get('/api/rates/', {
            'base': 'EUR',
            'symbols': 'USD',
            'start_date': '2020-01-01',
            'end_date': '2025-01-01',
        })
        self.assertEqual(resp.status_code, 400)
        self.assertIn('2 years', resp.json()['error'])


class CurrenciesEndpointTests(TestCase):
    def test_returns_supported_currencies(self):
        resp = APIClient().get('/api/currencies/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(set(data.keys()), {'EUR', 'USD', 'CAD'})
        self.assertEqual(data['EUR'], 'Euro')


class ExchangeRateModelTests(TestCase):
    def test_update_or_create_prevents_duplicates(self):
        params = {
            'date': '2024-06-03',
            'base_currency': 'EUR',
            'target_currency': 'USD',
        }
        ExchangeRate.objects.update_or_create(**params, defaults={'rate': Decimal('1.0842')})
        ExchangeRate.objects.update_or_create(**params, defaults={'rate': Decimal('1.0900')})

        self.assertEqual(ExchangeRate.objects.filter(**params).count(), 1)
        self.assertEqual(ExchangeRate.objects.get(**params).rate, Decimal('1.0900'))
