from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
# Create your views here.

def login_view(request):
    form = AuthenticationForm()
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('/')
        else :
            print("Jopa")
    context = {
        'form': form,
        'btn_label': 'Login',
        'title': 'Login Page'
    }

    return render(request, 'accounts/form.html', context)

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('/login')
    context = {
        'btn_label': 'Logout',
        'title': 'Logout Page'
    }
    return render(request, 'accounts/form.html', context)

def registration_view(request):
    form = UserCreationForm()
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=True)
            user.set_password(form.cleaned_data.get('password1'))
            login(request, user)
            return redirect('/')
        else:
            return redirect('/login')
    context = {
        'form': form,
        'btn_label': 'Register',
        'title': 'Registration Page'
    }
    return render(request, 'accounts/form.html', context)