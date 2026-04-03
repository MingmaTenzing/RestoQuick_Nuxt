export default defineNuxtRouteMiddleware(() => {
  const { isSignedIn, userId, isLoaded } = useAuth();
  console.log("i running");
  if (!isSignedIn.value && !userId.value) {
    return navigateTo("/sign-in");
  }
});
