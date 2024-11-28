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
from .models import Venta, Factura
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from django.db.models import Sum, Count
from django.db import transaction
from datetime import date
from .models import Venta, DetalleVenta, Factura

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Si es un vendedor, verificar el estado del día
            if user.groups.filter(name="vendedor").exists():
                estado_actual = EstadoDiaVentas.objects.first()
                if estado_actual and not estado_actual.abierto:
                    return JsonResponse(
                        {"detail": "El sistema está cerrado. No puede iniciar sesión en este momento."},
                        status=403
                    )
                login(request, user)
                return JsonResponse({"role": "vendedor"})
            
            # Si es un gerente, permitir el acceso
            elif user.groups.filter(name="gerente").exists():
                login(request, user)
                return JsonResponse({"role": "gerente"})

            # Si pertenece a otros roles, denegar acceso
            else:
                return JsonResponse({"detail": "No tiene permisos para iniciar sesión."}, status=403)
        else:
            return JsonResponse({"detail": "Credenciales incorrectas"}, status=401)
    return JsonResponse({"detail": "Método no permitido"}, status=405)


@require_POST
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "No estás en sesión"}, status=400)
    logout(request)
    return JsonResponse({"detail": "Sesión cerrada exitosamente"})

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
    if request.method == "POST":
        estado_actual = EstadoDiaVentas.objects.first()
        
        if not estado_actual:
            estado_actual = EstadoDiaVentas.objects.create(abierto=False)
        
        if estado_actual.abierto:
            # Si el día está abierto, cerrarlo
            with transaction.atomic():
                estado_actual.abierto = False
                estado_actual.inicio_dia = None  # Reinicia el tiempo de inicio
                estado_actual.save()

            return JsonResponse({
                "estado": "cerrado", 
                "inicio_dia": None, 
                "mensaje": "El día de ventas se ha cerrado. Las ventas no se han eliminado."
            })
        else:
            # Si el día está cerrado, abrirlo
            with transaction.atomic():
                # Eliminar las ventas del día actual al abrir el nuevo día
                Venta.objects.filter(fecha_venta__date=date.today()).delete()
                estado_actual.abierto = True
                estado_actual.inicio_dia = now()  # Registra la hora de inicio
                estado_actual.save()

            return JsonResponse({
                "estado": "abierto", 
                "inicio_dia": estado_actual.inicio_dia, 
                "mensaje": "El día de ventas se ha abierto y las ventas del día actual se han eliminado."
            })

    return JsonResponse({"detail": "Método no permitido"}, status=405)



def obtener_estado_ventas(request):
    estado_actual = EstadoDiaVentas.objects.first()
    estado = "abierto" if estado_actual and estado_actual.abierto else "cerrado"
    inicio_dia = estado_actual.inicio_dia if estado_actual else None
    return JsonResponse({'estado': estado, 'inicio_dia': inicio_dia})



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
    
from django.db import transaction

@csrf_exempt
@login_required
def registrar_venta(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            tipo_documento = data.get("tipoDocumento")
            total = data.get("total")
            factura_data = data.get("facturaData", {})
            carrito = data.get("carrito", [])

            # Verificar que el carrito no esté vacío
            if not carrito:
                return JsonResponse({"status": "failed", "error": "El carrito está vacío"}, status=400)

            with transaction.atomic():
                # Crear la venta
                venta = Venta.objects.create(
                    vendedor=request.user,
                    total=total,
                    tipo_documento=tipo_documento
                )

                # Agregar detalles de los productos
                for item in carrito:
                    DetalleVenta.objects.create(
                        venta=venta,
                        producto=item['nombre'],
                        cantidad=item['cantidadSeleccionada'],
                        precio_unitario=item['valor_unitario']
                    )

                # Si es factura, crea la factura relacionada
                if tipo_documento == "factura":
                    Factura.objects.create(
                        venta=venta,
                        razon_social=factura_data["razonSocial"],
                        rut=factura_data["rut"],
                        giro=factura_data["giro"],
                        direccion=factura_data["direccion"],
                        total=total
                    )

            return JsonResponse({"status": "success", "venta_id": venta.id})

        except Exception as e:
            return JsonResponse({"status": "failed", "error": str(e)}, status=500)
    return JsonResponse({"status": "failed", "error": "Método no permitido"}, status=405)





@login_required
def obtener_ventas(request):
    try:
        # Recuperar las ventas y sus detalles asociados
        ventas = Venta.objects.prefetch_related('detalleventa_set').values(
            'id', 
            'total', 
            'tipo_documento', 
            'fecha_venta', 
            'vendedor__username'
        )

        # Formatear los datos para incluir detalles de productos
        ventas_con_detalles = []
        for venta in ventas:
            detalles = DetalleVenta.objects.filter(venta_id=venta['id']).values(
                'producto', 'cantidad', 'precio_unitario'
            )
            venta['detalles'] = list(detalles)
            ventas_con_detalles.append(venta)

        return JsonResponse({"ventas": ventas_con_detalles})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@login_required
def informe_ventas_dia(request):
    # Filtrar ventas por tipo de documento
    ventas_con_boleta = Venta.objects.filter(tipo_documento="boleta")
    ventas_con_factura = Venta.objects.filter(tipo_documento="factura", factura__isnull=False)

    # Agregar datos para boletas
    total_boletas = ventas_con_boleta.aggregate(
        cantidad_boletas=Count('id'),
        total_boletas=Sum('total')
    )

    # Agregar datos para facturas
    total_facturas = ventas_con_factura.aggregate(
        cantidad_facturas=Count('id'),
        total_facturas=Sum('total')
    )

    # Detalles de facturas
    facturas_detalle = ventas_con_factura.select_related('factura').values(
        'factura__numero',
        'factura__razon_social',
        'factura__rut',
        'factura__giro',
        'factura__direccion',
        'total',  # Total de la venta
        'fecha_venta'  # Fecha de la venta
    )

    facturas_list = [
        {
            "numero": factura['factura__numero'],
            "razon_social": factura['factura__razon_social'],
            "rut": factura['factura__rut'],
            "giro": factura['factura__giro'],
            "direccion": factura['factura__direccion'],
            "total": factura['total'],
            "fecha": factura['fecha_venta'].strftime("%Y-%m-%d %H:%M:%S"),
        }
        for factura in facturas_detalle
    ]

    return JsonResponse({
        "cantidad_boletas": total_boletas['cantidad_boletas'] or 0,
        "total_boletas": total_boletas['total_boletas'] or 0.0,
        "cantidad_facturas": total_facturas['cantidad_facturas'] or 0,
        "total_facturas": total_facturas['total_facturas'] or 0.0,
        "facturas": facturas_list,
    })






