// lib/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDr5i3QbVgfRCVb4R4VDG7WB2wjU8xuDLc",
    authDomain: "ecommerce-store-af87d.firebaseapp.com",
    projectId: "ecommerce-store-af87d",
    storageBucket: "ecommerce-store-af87d.appspot.com",
    messagingSenderId: "801327010700",
    appId: "1:801327010700:web:03ef2696a40735e65efca9",
    measurementId: "G-798X0KFE6H"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
