export default defineNuxtRouteMiddleware(() => {
  const { isSignedIn, userId, isLoaded } = useAuth();

  if (!isSignedIn.value && !userId.value) {
    return navigateTo("/sign-in");
  }
});
