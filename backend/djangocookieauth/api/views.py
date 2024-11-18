from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Producto
from django.core.serializers import serialize
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import EstadoDiaVentas
from .models import Venta
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from django.db.models import Sum, Count

@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Ingrese su usuario y contraseña"}, status=400)
    
    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Credenciales incorrectas"}, status=400)
    
    login(request, user)

    role = None
    if user.groups.filter(name="vendedor").exists():
        role = "vendedor"
    elif user.groups.filter(name="gerente").exists():
        role = "gerente"

    return JsonResponse({"detail": "Ingreso correcto", "role": role})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "No estas en sesion"}, status = 400)
    logout(request)
    return JsonResponse({"detail": "Sesion Cerrada exitosamente"})

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    
    # Obtener el rol del usuario
    role = None
    if request.user.groups.filter(name="vendedor").exists():
        role = "vendedor"
    elif request.user.groups.filter(name="gerente").exists():
        role = "gerente"
    return JsonResponse({"isAuthenticated": True, "role": role})


@csrf_exempt
def cambiar_estado_ventas(request):
    if request.method == 'POST':
        estado_actual, created = EstadoDiaVentas.objects.get_or_create(id=1)
        estado_actual.abierto = not estado_actual.abierto
        estado_actual.save()
        
        estado = "abierto" if estado_actual.abierto else "cerrado"
        return JsonResponse({'estado': estado, 'mensaje': f'Día de ventas {estado} exitosamente'})

def obtener_estado_ventas(request):
    estado_actual = EstadoDiaVentas.objects.first()
    estado = "abierto" if estado_actual and estado_actual.abierto else "cerrado"
    return JsonResponse({'estado': estado})



# Vista para vendedor
def vendedor_dashboard_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "No estas en sesion"}, status=401)

    estado_ventas = get_object_or_404(EstadoDiaVentas)
    if not estado_ventas.abierto:
        return JsonResponse({"detail": "Las ventas están cerradas por hoy."}, status=403)

    return JsonResponse({"message": "Bienvenido, vendedor"})

# Vista para gerente
def gerente_dashboard_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "No estas en sesion"}, status=401)
    return JsonResponse({"message": "Bienvenido, gerente"})


@csrf_exempt
def agregar_producto(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nombre = data.get('nombre')
        codigo = data.get('codigo')
        cantidad = data.get('cantidad')
        valor_unitario = data.get('valor_unitario')
        categoria = data.get('categoria')  # Obtener la categoría

        if not (nombre and codigo and cantidad and valor_unitario and categoria):
            return JsonResponse({'error': 'Faltan datos'}, status=400)

        producto = Producto.objects.create(
            nombre=nombre,
            codigo=codigo,
            cantidad=cantidad,
            valor_unitario=valor_unitario,
            categoria=categoria  # Guardar la categoría en la base de datos
        )
        return JsonResponse({'message': 'Producto agregado correctamente'}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)


def listar_productos(request):
    productos = Producto.objects.all()
    productos_data = [
        {
            "id": producto.id,
            "nombre": producto.nombre,
            "categoria": producto.categoria,
            "fecha_registro": producto.fecha_registro.strftime("%Y-%m-%d"),
            "codigo": producto.codigo,
            "cantidad": producto.cantidad,
            "valor_unitario": str(producto.valor_unitario),
        }
        for producto in productos
    ]
    return JsonResponse(productos_data, safe=False)

@api_view(['DELETE'])
def eliminar_producto(request, id):
    try:
        producto = Producto.objects.get(id=id)
        producto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    
@csrf_exempt
def editar_producto(request, id):
    print("Método:", request.method)
    if request.method == 'PUT':
        print("ID del producto:", id)
        try:
            producto = Producto.objects.get(pk=id)
            print("Producto encontrado:", producto)
        except Producto.DoesNotExist:
            print("Producto no encontrado")
            return JsonResponse({'error': 'Producto no encontrado'}, status=404)

        # Procesa la solicitud y actualiza el producto...
        return JsonResponse({'mensaje': 'Producto actualizado correctamente'})
    else:
        print("Método no permitido")
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
@csrf_exempt
@login_required
def registrar_venta(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print("Datos recibidos:", data)  # Para verificar la recepción de datos
        print("Usuario autenticado:", request.user if request.user.is_authenticated else "No autenticado")

        tipo_documento = data.get("tipo_documento")
        total = data.get("total")
        vendedor = request.user  # Obteniendo el vendedor autenticado
        
        # Crear la venta
        venta = Venta.objects.create(
            vendedor=vendedor,
            total=total,
            tipo_documento=tipo_documento,
        )
        
        # Imprimir detalles de la venta para verificar
        print("Venta guardada:", venta.id, venta.total, venta.tipo_documento, venta.vendedor.username)
        
        # Enviar el ID de la venta, el nombre del vendedor y la fecha/hora de la venta como respuesta
        return JsonResponse({
            "status": "success",
            "venta_id": venta.id,
            "vendedor_nombre": vendedor.username,  # o vendedor.get_full_name() si deseas el nombre completo
            "fecha_venta": venta.fecha_venta.strftime("%Y-%m-%d %H:%M:%S")  # Formatear fecha y hora
        })
    
    return JsonResponse({"status": "failed"}, status=400)


@login_required
def obtener_ventas(request):
    ventas = Venta.objects.values(
        'id', 'total', 'tipo_documento', 'fecha_venta', 'vendedor__username'
    )
    return JsonResponse({"ventas": list(ventas)})


@login_required
def informe_ventas_dia(request):
    # Obtener ventas con boleta y factura sin filtrar por fecha (por ahora)
    ventas_con_boleta = Venta.objects.filter(tipo_documento="boleta")
    ventas_con_factura = Venta.objects.filter(tipo_documento="factura")
    
    # Calcular cantidad de boletas y total de dinero con boleta
    total_boletas = ventas_con_boleta.aggregate(cantidad_boletas=Count('id'), total_boletas=Sum('total'))
    
    # Calcular cantidad de facturas y total de dinero con factura
    total_facturas = ventas_con_factura.aggregate(cantidad_facturas=Count('id'), total_facturas=Sum('total'))
    
    print("Ventas con boleta:", list(ventas_con_boleta))  # Depuración
    print("Ventas con factura:", list(ventas_con_factura))  # Depuración
    print("Total boletas:", total_boletas)
    print("Total facturas:", total_facturas)
    
    # Responder con los datos
    return JsonResponse({
        "cantidad_boletas": total_boletas['cantidad_boletas'] or 0,
        "total_boletas": total_boletas['total_boletas'] or 0.0,
        "cantidad_facturas": total_facturas['cantidad_facturas'] or 0,
        "total_facturas": total_facturas['total_facturas'] or 0.0
    })






