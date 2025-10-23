<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


## Project specifics (Rental Platform)

### Email & Queue setup

You can test notificările de rezervare fără un cont real de email folosind una dintre variantele de mai jos.

#### Variante pentru email (dev)

- Varianta simplă (fără SMTP): folosește driverul `log`.
  - În `.env`, setează:
    - `MAIL_MAILER=log`
  - Emailurile vor fi scrise în `storage/logs/laravel.log`.

- Varianta cu Mailpit (vizual UI, recomandat):
  - Rulează un Mailpit local (Docker sau binar).
  - În `.env`, setează:
    - `MAIL_MAILER=smtp`
    - `MAIL_HOST=127.0.0.1`
    - `MAIL_PORT=1025`
    - `MAIL_USERNAME=null`
    - `MAIL_PASSWORD=null`
    - `MAIL_ENCRYPTION=null`
    - `MAIL_FROM_ADDRESS="no-reply@example.test"`
    - `MAIL_FROM_NAME="Rental Platform"`
  - UI-ul Mailpit este de obicei pe <http://localhost:8025>.

> Notă: Nu este nevoie de un cont extern (Gmail, SMTP provider) pentru dezvoltare.

#### Cozi (queues)

- Dev (implicit): `QUEUE_CONNECTION=sync` – notificările se trimit imediat, în același proces.
- Prod (recomandat): `QUEUE_CONNECTION=database` sau `redis`.
  - Pentru `database`:
    - Creează tabelul joburilor și rulează migrarea: `php artisan queue:table && php artisan migrate`.
    - Rulează workerul: `php artisan queue:work`.
  - Pentru `redis`:
    - Configurează Redis și setează `QUEUE_CONNECTION=redis`.
    - Rulează workerul: `php artisan queue:work`.

#### Când se trimit emailuri în aplicație

- La creare rezervare (`POST /api/bookings`):
  - Se trimite „BookingRequested” către proprietar și către oaspete.
- La schimbare status rezervare (`PUT /api/bookings/{id}`):
  - Când `status=confirmed`: „BookingConfirmed” pentru ambele părți; se setează `confirmed_at`.
  - Când `status=cancelled`: „BookingCancelled” pentru ambele părți; se setează `cancelled_at`.

  ```

  ### Admin moderation (Filament)

  - Panou admin: accesează `/admin` și autentifică-te cu un cont cu rol `admin`.
  - Accesul la panou este limitat la utilizatori cu `role=admin`.
  - Moderare recenzii: Navighează la Moderation → Reviews.
    - Lista este filtrată implicit pe `Pending`.
    - Acțiuni per review: Edit, Approve, Reject (doar pentru admin).
    - Acțiuni bulk: Approve Selected, Reject Selected (doar pentru admin).
  - Badge-ul de navigare arată numărul de recenzii în așteptare.

  Notă: Pe API public sunt returnate doar recenziile cu `status=approved` pentru paginile de proprietate.
