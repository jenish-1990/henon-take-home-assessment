from datetime import date, timedelta

from dashboard.services import fetch_exchange_rates


# TODO: hook this up to celery beat or a cron job on the 1st of each month
def refresh_monthly_rates():
    today = date.today()
    first_of_this_month = today.replace(day=1)
    last_month_end = first_of_this_month - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)

    fetch_exchange_rates(
        base='EUR',
        symbols='USD,CAD',
        start_date=str(last_month_start),
        end_date=str(last_month_end),
    )
