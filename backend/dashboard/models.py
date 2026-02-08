from django.db import models


class ExchangeRate(models.Model):
    date = models.DateField()
    base_currency = models.CharField(max_length=3)
    target_currency = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=12, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('date', 'base_currency', 'target_currency')

    def __str__(self):
        return f'{self.date} {self.base_currency}/{self.target_currency}: {self.rate}'
