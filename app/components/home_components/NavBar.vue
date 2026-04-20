<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import logoUrl from '~/assets/images/RestoQuick.png';

const colorMode = useColorMode();
const router = useRouter();
const { isLoaded, signIn, setActive } = useSignIn();
const scrolled = ref(false);
const isDemoSigningIn = ref(false);

const runtime = useRuntimeConfig();

const demoCredentials = computed(() => ({
  email: runtime.public.DEMO_CLERK_EMAIL,
  password: runtime.public.DEMO_CLERK_PASSWORD,
}));

const links = [
  { label: 'Features', href: '#features' },
  { label: 'AI Assistant', href: '#maya' },
  { label: 'Pricing', href: '#pricing' },
];

const isDark = computed(() => colorMode.value === 'dark');
const logoClasses = computed(() =>
  isDark.value ? 'brightness-0 invert' : '',
);
const navClasses = computed(() =>
  'border-b border-border bg-background shadow-md',
);
const navItemClasses = computed(() =>
  'text-muted-foreground hover:text-primary',
);
const actionClasses = computed(() =>
  'inline-flex items-center rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60',
);
const ctaClasses = computed(() =>
  'bg-green-600 text-white hover:bg-green-700',
);

const signInToDemo = async () => {
  if (!isLoaded.value || !signIn.value || !setActive.value || isDemoSigningIn.value) {
    return;
  }

  if (!demoCredentials.value.email || !demoCredentials.value.password) {
    return;
  }

  isDemoSigningIn.value = true;

  try {
    const signInAttempt = await signIn.value.create({
      strategy: 'password',
      identifier: demoCredentials.value.email,
      password: demoCredentials.value.password,
    });

    if (signInAttempt.status !== 'complete' || !signInAttempt.createdSessionId) {
      return;
    }

    await setActive.value({
      session: signInAttempt.createdSessionId,
    });

    await router.push('/dashboard');
  } catch (error) {
    console.error('Demo sign-in failed', error);
  } finally {
    isDemoSigningIn.value = false;
  }
};

const updateScrollState = () => {
  scrolled.value = window.scrollY > 12;
};

onMounted(() => {
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState);
});
</script>

<template>
  <header class="sticky top-0 z-50">
    <nav class="flex w-full items-center justify-between px-4 py-3 transition duration-300 sm:px-6" :class="navClasses"
      aria-label="Primary">
      <NuxtLink to="/" class="flex items-center px-2 py-1.5">
        <img :src="logoUrl" alt="RestoQuick" class="h-10 w-auto transition sm:h-11 invert" :class="logoClasses">
      </NuxtLink>

      <div class="hidden items-center gap-2 lg:flex">
        <a v-for="link in links" :key="link.label" :href="link.href"
          class="px-4 py-2.5 text-sm font-medium transition duration-200" :class="navItemClasses">
          {{ link.label }}
        </a>
      </div>


      <div class="flex items-center gap-4 sm:gap-5">
        <Show when="signed-out">
          <button type="button"
            :disabled="isDemoSigningIn || !isLoaded || !demoCredentials.email || !demoCredentials.password"
            :class="actionClasses" @click="signInToDemo">
            {{ isDemoSigningIn ? 'Signing In...' : 'View Demo' }}
          </button>
        </Show>
        <NuxtLink to="/dashboard"
          class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition"
          :class="ctaClasses">
          <span class="hidden sm:inline">View Dashboard</span>
        </NuxtLink>
        <Show when="signed-out">
          <div class="flex items-center gap-3">
            <SignInButton :force-redirect-url="runtime.public.CLERK_SIGN_IN_FORCE_REDIRECT_URL">

              <button type="button" :class="actionClasses">
                Sign In
              </button>
            </SignInButton>

          </div>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  </header>
</template>