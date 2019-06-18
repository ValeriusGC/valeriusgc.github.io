import 'package:angular/angular.dart';
import 'package:angular_tour_of_heroes/app_component.template.dart' as ng;
import 'package:pwa/client.dart' as pwa;

void main() {
  // register PWA ServiceWorker for offline caching.
  pwa.Client();
  runApp(ng.AppComponentNgFactory);
}
