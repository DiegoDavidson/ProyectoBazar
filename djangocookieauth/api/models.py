from django.db import models

class Producto(models.Model):
    codigo = models.CharField(max_length=100, unique=True)
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    def total_por_producto(self):
        return self.cantidad * self.valor_unitario

    def __str__(self):
        return self.nombre

class Venta(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad_vendida = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def total_por_venta(self):
        return self.cantidad_vendida * self.producto.valor_unitario

    def __str__(self):
        return f"Venta de {self.producto.nombre} el {self.fecha}"
