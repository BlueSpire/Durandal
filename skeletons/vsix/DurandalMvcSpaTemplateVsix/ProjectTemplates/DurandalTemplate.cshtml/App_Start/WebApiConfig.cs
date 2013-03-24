﻿using System.Web.Http;

namespace $safeprojectname$ {
  public static class WebApiConfig {
    public static void Register(HttpConfiguration config) {
      config.Routes.MapHttpRoute(
        name:"DefaultApi",
        routeTemplate:"api/{controller}/{id}",
        defaults:new {id = RouteParameter.Optional}
        );
    }
  }
}