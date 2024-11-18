from django.urls import path
from . import views
from .views import agregar_producto
from .views import listar_productos
from .views import eliminar_producto
from .views import cambiar_estado_ventas, vendedor_dashboard_view
from .views import registrar_venta

urlpatterns = [
    path("login/", views.login_view, name="api_login"),
    path("logout/", views.logout_view, name="api_logout"),
    path("session/", views.session_view, name="api_session"),
    path("vendedor-dashboard/", views.vendedor_dashboard_view, name="vendedor_dashboard"),
    path("gerente-dashboard/", views.gerente_dashboard_view, name="gerente_dashboard"),
    path('agregar-producto/', agregar_producto, name='agregar_producto'),
    path('listar-productos/', listar_productos, name='listar_productos'),
    path('eliminar-producto/<int:id>/', views.eliminar_producto, name='eliminar_producto'),
    path('api/editar-producto/<int:id>/', views.editar_producto, name='editar_producto'),
    path('cambiar_estado_ventas', cambiar_estado_ventas, name='cambiar_estado_ventas'),
    path('obtener_estado_ventas/', views.obtener_estado_ventas, name='obtener_estado_ventas'),
    path("registrar-venta/", registrar_venta, name="registrar_venta"),
    path('obtener_ventas/', views.obtener_ventas, name='obtener_ventas'),
    path('InformeVentas/', views.obtener_ventas, name='InformeVentas'),
    path('informe-ventas-dia', views.informe_ventas_dia, name='informe-ventas-dia'),

]
