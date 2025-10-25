<?php

return [
    // Navigare
    'navigation' => [
        'users' => 'Utilizatori',
        'properties' => 'Proprietăți',
        'bookings' => 'Rezervări',
        'reviews' => 'Recenzii',
        'settings' => 'Setări',
        'activity_log' => 'Jurnal Activitate',
    ],

    // Gestionare Utilizatori
    'users' => [
        'title' => 'Utilizatori',
        'create' => 'Creare Utilizator',
        'edit' => 'Editare Utilizator',
        'delete' => 'Ștergere Utilizator',
        'export' => 'Export în Excel',
        'fields' => [
            'name' => 'Nume',
            'email' => 'Email',
            'password' => 'Parolă',
            'role' => 'Rol',
            'phone' => 'Telefon',
            'locale' => 'Limbă',
            'verified' => 'Verificat',
            'profile_photo' => 'Fotografie Profil',
        ],
        'roles' => [
            'guest' => 'Oaspete',
            'owner' => 'Proprietar',
            'admin' => 'Administrator',
            'super_admin' => 'Super Administrator',
        ],
    ],

    // Gestionare Proprietăți
    'properties' => [
        'title' => 'Proprietăți',
        'create' => 'Creare Proprietate',
        'edit' => 'Editare Proprietate',
        'delete' => 'Ștergere Proprietate',
        'export' => 'Export în Excel',
        'fields' => [
            'title' => 'Titlu',
            'description' => 'Descriere',
            'price_per_night' => 'Preț pe Noapte',
            'price_per_month' => 'Preț pe Lună',
            'bedrooms' => 'Dormitoare',
            'bathrooms' => 'Băi',
            'city' => 'Oraș',
            'status' => 'Stare',
        ],
    ],

    // Tablou de Bord
    'dashboard' => [
        'welcome' => 'Bine ați venit în Panoul de Administrare',
        'stats' => [
            'total_users' => 'Total Utilizatori',
            'admin_users' => 'Utilizatori Admin',
            'verified_users' => 'Utilizatori Verificați',
            'new_this_month' => 'Noi Luna Aceasta',
            'total_properties' => 'Total Proprietăți',
            'recent_properties' => 'Proprietăți Recente',
        ],
    ],

    // Comun
    'common' => [
        'save' => 'Salvează',
        'cancel' => 'Anulează',
        'delete' => 'Șterge',
        'edit' => 'Editează',
        'view' => 'Vizualizează',
        'search' => 'Caută',
        'filter' => 'Filtrează',
        'export' => 'Exportă',
        'import' => 'Importă',
        'actions' => 'Acțiuni',
        'created_at' => 'Creat La',
        'updated_at' => 'Actualizat La',
    ],

    // Mesaje
    'messages' => [
        'saved_successfully' => 'Salvat cu succes',
        'deleted_successfully' => 'Șters cu succes',
        'error_occurred' => 'A apărut o eroare',
        'confirm_delete' => 'Sigur doriți să ștergeți acest element?',
        'no_permission' => 'Nu aveți permisiunea de a efectua această acțiune',
        'cannot_edit_super_admin' => 'Nu puteți edita un Super Administrator',
    ],
];
