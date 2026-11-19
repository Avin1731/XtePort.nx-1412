# Changelog

## [0.3.0](https://github.com/Avin1731/XtePort.nx-1412/compare/a-1412-v0.2.1...a-1412-v0.3.0) (2026-11-19)


### Features

* **email:** add centralized Resend mail helper with replyTo support ([6a945e6](https://github.com/Avin1731/XtePort.nx-1412/commit/6a945e667928035c77aa0ba6aa889945df5963ce))


### Bug Fixes

* **email:** migrate email actions to centralized xteonlyone.my.id sender ([b834a43](https://github.com/Avin1731/XtePort.nx-1412/commit/b834a437bcc3e1bf8880a5e315886b68b350e0e4))
* **email:** migrate Resend sender to xteonlyone.my.id with replyTo ([4413321](https://github.com/Avin1731/XtePort.nx-1412/commit/441332166cd2f5b4efa545efe8a8473d8deed496))

## [0.2.1](https://github.com/Avin1731/XtePort.nx-1412/compare/a-1412-v0.2.0...a-1412-v0.2.1) (2026-11-18)


### Bug Fixes

* **auth:** split edge-safe auth config and fix theme toggle ([fbd955d](https://github.com/Avin1731/XtePort.nx-1412/commit/fbd955d048a2ce52708d84769e9c854fa2120cd1))

## [0.2.0](https://github.com/Avin1731/XtePort.nx-1412/compare/a-1412-v0.1.0...a-1412-v0.2.0) (2026-11-16)


### Features

* A.implement blog engine (admin dashboard, schema, and server actions) ([8105afe](https://github.com/Avin1731/XtePort.nx-1412/commit/8105afe9413fffa156c7630f213e9a8d2bf421b9))
* A.implement multi-image gallery with carousel support, schema update, and dual upload mode ([e5ee26a](https://github.com/Avin1731/XtePort.nx-1412/commit/e5ee26a7e78df0852eee71a4374c6323c046054d))
* A.implement public blog pages with pagination, carousel gallery, and markdown support ([6ed7dd5](https://github.com/Avin1731/XtePort.nx-1412/commit/6ed7dd542b9265fe6504807d85a6e2970ad87092))
* A.implement tag filtering, glassmorphism delete dialog, and fix dashboard client components ([d63a0ff](https://github.com/Avin1731/XtePort.nx-1412/commit/d63a0ff322a4669b78ed676e19e8a2f2348f7bec))
* A.integrate Cloudinary for image uploads, custom dropzone, and cleanup UploadThing ([88b42f1](https://github.com/Avin1731/XtePort.nx-1412/commit/88b42f19e74b479a323f1ea5ec39536d8d6c5642))
* A.setup blog engine backend (schema, db config, server actions) ([ebab71a](https://github.com/Avin1731/XtePort.nx-1412/commit/ebab71a999d0bf8b94eb618669a25f0923bcdb9e))
* A.update like system, view counter, and fix db schema ([6ac5ab1](https://github.com/Avin1731/XtePort.nx-1412/commit/6ac5ab1b1858f5c65728c93d7f618fe0e65ec40f))
* add notification bell, optimize navbar home link, and admin dashboard trigger ([8e12618](https://github.com/Avin1731/XtePort.nx-1412/commit/8e126186ffc249fa42d3c1be2404ec1537429419))
* add social schema (replies, likes, notifs) and server actions ([2959fe4](https://github.com/Avin1731/XtePort.nx-1412/commit/2959fe417476260880e8c97df3a4dada3164c627))
* add unique visitor stats and update dashboard card styles ([3b6a559](https://github.com/Avin1731/XtePort.nx-1412/commit/3b6a5599a70f516165820e697736542fced82728))
* **analytics:** implement visitor tracking with ip and user agent logging ([d4ea961](https://github.com/Avin1731/XtePort.nx-1412/commit/d4ea961367c472514b4035e8896009dfeaa68f1f))
* **chat:** implement full message system with admin inbox ([e8c6b55](https://github.com/Avin1731/XtePort.nx-1412/commit/e8c6b55c089f43495e8b1bb94d5f5ffaaaa50c2a))
* **chat:** implement premium chat widget with animated ui and smooth scroll ([36bbd3f](https://github.com/Avin1731/XtePort.nx-1412/commit/36bbd3f49a416e049516e53ba0a3e4474954d32a))
* **cms:** implement project management with CRUD actions and UI ([2e8b98e](https://github.com/Avin1731/XtePort.nx-1412/commit/2e8b98e126f03c59e387e598d8831526ee372882))
* complete admin guestbook dashboard with manual query, thread view, and read status logic ([2827c72](https://github.com/Avin1731/XtePort.nx-1412/commit/2827c72c962cf66b97c19ffbfe6789d56e199b1f))
* complete auth integration and login ui ([25da7db](https://github.com/Avin1731/XtePort.nx-1412/commit/25da7dbdb66b0062328cf30b49bf3000156dc0d0))
* **content:** implement profile/about engine and public projects pages ([77da35f](https://github.com/Avin1731/XtePort.nx-1412/commit/77da35ff4b7936bf74c91a7dd121d968f8fe018e))
* create framer motion wrapper component ([5afacb0](https://github.com/Avin1731/XtePort.nx-1412/commit/5afacb08838f7f6050a4348551bd8634a8be13bd))
* **dashboard:** add stats cards and setup projects schema with actions ([e1029cd](https://github.com/Avin1731/XtePort.nx-1412/commit/e1029cd5669f9e6ba81a4ec9cb48e6594fc6727a))
* **dashboard:** implement tech stack cms and optimize admin ui layout ([838ff3b](https://github.com/Avin1731/XtePort.nx-1412/commit/838ff3bdf994d9b06c926d1a059ce3f1469a116e))
* **dashboard:** setup admin layout and sidebar structure ([0b0861a](https://github.com/Avin1731/XtePort.nx-1412/commit/0b0861af21df326c5e139542029784a7df99c690))
* define database schemas ([9467188](https://github.com/Avin1731/XtePort.nx-1412/commit/94671886bf9ecffc20eeb691fd173ce8acee6874))
* enhance admin guestbook with reply/like actions, thread UI polish, and dashboard chat visibility logic ([be83cd0](https://github.com/Avin1731/XtePort.nx-1412/commit/be83cd07b3ff7918d5b5f7b8f5fab872982976d8))
* enhance admin guestbook with reply/like actions, thread UI polish, emails, and chat logic ([5429048](https://github.com/Avin1731/XtePort.nx-1412/commit/54290481a55ee1b4ace777111cc3b27890dad508))
* **guestbook:** implement public guestbook and admin moderation ([4d7bb77](https://github.com/Avin1731/XtePort.nx-1412/commit/4d7bb7717ef62f151e07fe5292c9bb389c28592a))
* implement admin email reply system via Resend and upgrade inbox UI ([3042981](https://github.com/Avin1731/XtePort.nx-1412/commit/3042981f305d253acda3bad5cac31053761617d0))
* implement admin thread view and delete reply logic using manual queries ([978d03a](https://github.com/Avin1731/XtePort.nx-1412/commit/978d03a367ba3dde6939adc23e63bffb0a804207))
* implement dark mode toggle ([b9c9b5a](https://github.com/Avin1731/XtePort.nx-1412/commit/b9c9b5a293fe4e940a15f4f95f5e0f1e6f2ee195))
* implement email loop notification via Resend + Custom Domain and update docs ([6bfef68](https://github.com/Avin1731/XtePort.nx-1412/commit/6bfef68f9f827381285130b6d98152f7175d5744))
* implement notification center and fix logout redirect ([bf0a2e1](https://github.com/Avin1731/XtePort.nx-1412/commit/bf0a2e10fe23262a76269d90f00704bfe698b080))
* implement reply likes and threaded mentions ([9f6b99d](https://github.com/Avin1731/XtePort.nx-1412/commit/9f6b99db7b063cae839fd96cf4ee035bf02e5586))
* implement role-based middleware protection ([74d899b](https://github.com/Avin1731/XtePort.nx-1412/commit/74d899b205005dfe4d2fe7d65b076de0d321d0b9))
* implement social UI (optimistic like, reply dialog) and fix avatar image policy ([1c5f4ed](https://github.com/Avin1731/XtePort.nx-1412/commit/1c5f4ed525b76917953fe9b5d2023e82e6fd03a7))
* improve admin inbox notification badge ([a338f2e](https://github.com/Avin1731/XtePort.nx-1412/commit/a338f2e55c50ed50d26c6cdf678502c4a3232cb2))
* **search:** implement global search across blog and projects ([827cb9b](https://github.com/Avin1731/XtePort.nx-1412/commit/827cb9b84074f2c2a34e132c500f1a18e4c14916))
* upgrade guestbook to forum v2 and add admin inbox notification badge ([0f06ea3](https://github.com/Avin1731/XtePort.nx-1412/commit/0f06ea3af6d43b3b092e2f78d33c3e298c86754a))


### Bug Fixes

* **blog:** support markdown tables and setup auto-versioning ([7b2744a](https://github.com/Avin1731/XtePort.nx-1412/commit/7b2744a1eb6ed3bccfbd45f288fc38fa9e5abab3))
* **lockfile:** sync pnpm-lock.yaml with remark-gfm ([20c3e52](https://github.com/Avin1731/XtePort.nx-1412/commit/20c3e52317346a8d7f0b8370b352693d4cef3826))
* multiple guestbook bugs - reply form focus, like button state, avatar display, date formatting, topic filtering, mobile responsiveness, form validation, and performance optimizations ([e848625](https://github.com/Avin1731/XtePort.nx-1412/commit/e84862553649079d44cedee13876ef7b4d3215ba))
* resolve email template rendering issues by using inline styles a… ([a8bdf7b](https://github.com/Avin1731/XtePort.nx-1412/commit/a8bdf7b564b2b5dfe637d5f6dcea306a43d148fd))
* resolve email template rendering issues by using inline styles and update logo source ([4d6d8e1](https://github.com/Avin1731/XtePort.nx-1412/commit/4d6d8e146143927fe2be5b098fcc555cb86a155a))
