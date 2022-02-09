from django.contrib.auth import login, logout, authenticate, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import LoginSerializer, UserSerial, QuerySerial, RegisterSerial
from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser


User = get_user_model()


class UserListView(generics.ListCreateAPIView): 
    queryset = User.objects.all()
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = self.queryset.all()
        if self.request.query_params.get('part_room', None): # return users who are NOT participants of referenced room
            qry_params = QuerySerial(data=self.request.query_params)
            qry_params.is_valid(raise_exception=True)
            queryset = queryset.exclude(participant__room__id=qry_params.validated_data['part_room'])
        return queryset

    def get_serializer_class(self):
        return RegisterSerial if self.request.method == 'POST' else UserSerial



@api_view(['POST'])
def login_view(request):

    if request.user.is_authenticated:
       return Response(data={"error": "User is alredy authenticated"},
                        status=status.HTTP_400_BAD_REQUEST)

    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(request, username=serializer.validated_data['username'],
                        password=serializer.validated_data['password'])

    if user:
        login(request,user)
        return Response(UserSerial(user,context={'request': request} ).data)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response(UserSerial(request.user, context={'request': request} ).data)