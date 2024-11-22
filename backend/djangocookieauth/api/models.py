from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Producto(models.Model):
    CATEGORIAS = [
        ('Papelería y Escritura', 'Papelería y Escritura'),
        ('Cuadernos y Agendas', 'Cuadernos y Agendas'),
        ('Material Escolar', 'Material Escolar'),
        ('Arte y Manualidades', 'Arte y Manualidades'),
        ('Tecnología y Accesorios', 'Tecnología y Accesorios'),
        ('Oficina y Negocios', 'Oficina y Negocios'),
        ('Libros y Lectura', 'Libros y Lectura'),
        ('Regalos y Decoración', 'Regalos y Decoración'),
    ]

    codigo = models.CharField(max_length=100, unique=True)
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default='Sin categoría')
    fecha_registro = models.DateTimeField(default=timezone.now) 

    
    def total_por_producto(self):
        return self.cantidad * self.valor_unitario

    def __str__(self):
        return self.nombre
    

class EstadoDiaVentas(models.Model):
    abierto = models.BooleanField(default=True)
    fecha = models.DateField(auto_now=True)

    def __str__(self):
         return "Abierto" if self.abierto else "Cerrado"
    
class Venta(models.Model):
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_documento = models.CharField(
        max_length=10,
        choices=[('Boleta', 'Boleta'), ('Factura', 'Factura')],
        null=False
    )
    fecha_venta = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Venta {self.id} - {self.tipo_documento} - {self.vendedor.username}"

