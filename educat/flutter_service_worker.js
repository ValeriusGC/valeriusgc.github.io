'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/assets/images/middle_cat_on_books.png": "78410b295b726a8681b2f6361fd7b231",
"assets/assets/images/plot.png": "4756292a52a6f6dcb88332edeb27e4f1",
"assets/assets/images/logo_design_gorizont.png": "49609a6a64939cbfcecbf2428ce7c379",
"assets/assets/images/html5.png": "4aa786739527914ca94a68fedc0b5b65",
"assets/assets/images/big_cat_on_books.png": "4b81726eee251d43ab90d2e15ee5714f",
"assets/assets/images/target.png": "731f3ea219b9b45c24622a1a92d5fcab",
"assets/assets/images/paw_02.png": "ab5fcb295e07e1e97799829d218bc157",
"assets/assets/images/paw_01.png": "21043be9e97cc4101e8e034d7043053d",
"assets/assets/images/middle_baloon.png": "97e666744b50cc27d9ddd637b56f4aaf",
"assets/assets/images/course_css.png": "66c4c277b46a77fc0f201edb8b632a60",
"assets/assets/images/icon_01.png": "e317c226248f25256c5d4e081f235858",
"assets/assets/images/greeting_image.png": "31d7029ab4db8e0f48ce9ae75c555c6e",
"assets/assets/images/icon_02.png": "fa7e84e2a65b91b144fab7476103844f",
"assets/assets/images/ellipse_course_02.png": "8b76edafa323e4f719c340582404da35",
"assets/assets/images/course_js.png": "550b86d40037d60e58f39d0ffa2d2010",
"assets/assets/images/profi_cat_on_books.png": "9a3c205b1f621e9914f93f4ac1e32161",
"assets/assets/images/paw_04.png": "916f4ed7daed884f8b75a1ec628e16a9",
"assets/assets/images/ellipse_course_01.png": "5147616a6640ea4e13fda4019467721d",
"assets/assets/images/course_html.png": "70b67a7f4eb49ae6ae43b1bccf327479",
"assets/assets/images/paw_03.png": "012b7a4d85b9be1ec9e5fcd3d7ba1504",
"assets/assets/translations/en.json": "56d4f7ec50a2dc698b2ccb7d2da60301",
"assets/assets/translations/ru.json": "416e4404b7845e127de687905f0e2487",
"assets/assets/translations/cs.json": "b825dc85825970aeca08265abf4c940f",
"assets/NOTICES": "4b858bd9a181fd2b6e3828f7cf2ce822",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/AssetManifest.json": "7cb00dbe8c69eaf5c4e8e43deed2ef33",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/packages/easy_localization/i18n/ar.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/en.json": "5bd908341879a431441c8208ae30e4fd",
"assets/packages/easy_localization/i18n/ar-DZ.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/en-US.json": "5bd908341879a431441c8208ae30e4fd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a126c025bab9a1b4d8ac5534af76a208",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d80ca32233940ebadc5ae5372ccd67f9",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "831eb40a2d76095849ba4aecd4340f19",
"index.html": "58bc58e67e6579f6e6ead982484e40d8",
"/": "58bc58e67e6579f6e6ead982484e40d8",
"manifest.json": "b326460e36849eff03f31f8f3d3c6a42",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"version.json": "630afcac59f3ea0ec91cf7f76c54982b",
"main.dart.js": "3b9fc543c98333e461ae2dd42a8cd5a9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a 'reload' param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'reload'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
