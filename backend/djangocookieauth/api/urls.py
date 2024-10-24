from django.urls import path
from . import views
from .views import agregar_producto
from .views import listar_productos

urlpatterns = [
    path("login/", views.login_view, name="api_login"),
    path("logout/", views.logout_view, name="api_logout"),
    path("session/", views.session_view, name="api_session"),
    path("vendedor-dashboard/", views.vendedor_dashboard_view, name="vendedor_dashboard"),
    path("gerente-dashboard/", views.gerente_dashboard_view, name="gerente_dashboard"),
    path('agregar-producto/', agregar_producto, name='agregar_producto'),
    path('listar-productos/', listar_productos, name='listar_productos'),
]