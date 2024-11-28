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
    inicio_dia = models.DateTimeField(null=True, blank=True)

    def __str__(self):
         return "Abierto" if self.abierto else "Cerrado"

class Venta(models.Model):
    vendedor = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_documento = models.CharField(max_length=20, choices=[('boleta', 'Boleta'), ('factura', 'Factura')])
    fecha_venta = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Venta {self.id} - {self.tipo_documento}"

class Factura(models.Model):
    numero = models.AutoField(primary_key=True)
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE, related_name="factura")
    razon_social = models.CharField(max_length=200)
    rut = models.CharField(max_length=20)
    giro = models.CharField(max_length=200)
    direccion = models.CharField(max_length=200)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Factura {self.numero} - {self.razon_social} ({self.rut})"
    

class DetalleVenta(models.Model):
    venta = models.ForeignKey('Venta', related_name='detalles', on_delete=models.CASCADE)
    producto = models.CharField(max_length=255)  # Nombre del producto
    cantidad = models.PositiveIntegerField()  # Cantidad vendida
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)  # Precio por unidad

    def __str__(self):
        return f"{self.cantidad}x {self.producto} (Venta {self.venta.id})"



