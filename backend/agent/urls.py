from django.urls import include,path
from .views import AgentView, ask_agent, TagView
urlpatterns = [
    path('',AgentView.as_view(),name='agents' ),
    path('<int:agent_id>/',AgentView.as_view(),name="agent"),
    path('tags/', TagView.as_view(),name='tags'),
    path('<int:agent_id>/ask/', ask_agent,name = 'ask-agent'),
]
