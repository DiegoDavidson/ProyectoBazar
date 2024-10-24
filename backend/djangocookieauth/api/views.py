from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Producto

@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail": "Ingrese su usuario y contraseña"})
    user = authenticate(username = username, password = password)
    if user is None:
        return JsonResponse({"details": "invalid credentials"}, status=400)
    login(request, user)

    role = None
    if user.groups.filter(name="vendedor").exists():
        role = "vendedor"
    elif user.groups.filter(name="gerente").exists():
        role = "gerente"
    return JsonResponse({"details": "se ingreso correctamente", "role": role})

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



# Vista para vendedor
def vendedor_dashboard_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "No estas en sesion"}, status=401)
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

        if not (nombre and codigo and cantidad and valor_unitario):
            return JsonResponse({'error': 'Faltan datos'}, status=400)

        producto = Producto.objects.create(
            nombre=nombre,
            codigo=codigo,
            cantidad=cantidad,
            valor_unitario=valor_unitario
        )
        return JsonResponse({'message': 'Producto agregado correctamente'}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

def listar_productos(request):
    productos = Producto.objects.all().values('id', 'nombre', 'codigo', 'cantidad', 'valor_unitario')
    return JsonResponse(list(productos), safe=False)
