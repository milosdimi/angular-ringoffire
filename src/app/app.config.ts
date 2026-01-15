import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyB6OSN4_Uhit3oLroFvtlL0KoWrGRW2_Bg',
        authDomain: 'ring-of-fire-b43ae.firebaseapp.com',
        projectId: 'ring-of-fire-b43ae',
        storageBucket: 'ring-of-fire-b43ae.firebasestorage.app',
        messagingSenderId: '944150691152',
        appId: '1:944150691152:web:63f3aeb0abd13e39950055',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideAnimations()
  ],
};
