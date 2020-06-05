from django.shortcuts import render, redirect
from django.http import Http404, JsonResponse
from profiles.models import Profile
from .forms import ProfileForm
from django.contrib.auth.models import User

# Create your views here.

def get_profile_user(request, username):
    qs = Profile.objects.filter(user__username=username);
    if not qs.exists():
        raise Http404
    profile = qs.first()

    user = request.user
    show = True

    follow = ''
    if not user.is_anonymous:
        if user in profile.followers.all():
            follow = 'unfollow'
        else :
            follow = 'follow'
    if user.is_anonymous:
        show = False
    elif not user.is_anonymous and user.username == username:
        show = False
    context = {
        'username': username,
        'profile': profile,
        'show': show,
        'follow': follow
    }
    return render(request, 'profiles/base.html', context)

def profile_info(request):
    username = request.GET.get('username')
    if username:
        profile = Profile.objects.get(user__username=username)
        profile = profile.serialize()
        return JsonResponse({'profile': profile}, status=200)
    return JsonResponse({}, status=400)

def edit_profile(request):
    user = request.user
    if not user.is_authenticated:
        return redirect('/login')
    profile = user.profile
    initialData = {
        'first_name': user.first_name,
        'last_name': user.last_name
    }
    form = ProfileForm(data=request.POST or None, instance=profile, initial=initialData)
    if form.is_valid():
        profile_obj = form.save(commit=False)
        first_name = form.cleaned_data.get('first_name')
        last_name = form.cleaned_data.get('last_name')
        email = form.cleaned_data.get('email')

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()
        profile_obj.save()

        return redirect('/')

    context = {
        'form': form,
        'btn_label': 'Edit',
        'title': 'Edit Profile'
    }
    return render(request, 'profiles/edit.html', context)

def user_follow_view(request, username):
    current_user = request.user
    if current_user.is_authenticated:
        follow_user = User.objects.get(username=username)
        if current_user != follow_user:
            if follow_user:
                profile = follow_user.profile
                followers = profile.followers
                if request.GET.get('action') == 'follow':
                    followers.add(current_user)
                elif request.GET.get('action') == 'unfollow':
                    followers.remove(current_user)
                return JsonResponse({'followers': followers.all().count()}, status=200)
            return JsonResponse({'msg': 'user does not exist'}, status=404)
    return JsonResponse({}, status=200)