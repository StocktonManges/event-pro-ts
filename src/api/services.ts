import { Global } from "../utils/GlobalVarsAndFuncs";
import { Service, serviceSchema } from "../utils/types";
import { Requests } from "./getData";

export const ServicesRequests = {
  postService: (serviceInfo: Omit<Service, "id">): Promise<Service> =>
    fetch(`${Global.baseURL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create service.");
        }
        return response.json();
      })
      .then((service) => serviceSchema.parse(service)),

  patchService: (serviceInfo: Service): Promise<Service> =>
    fetch(`${Global.baseURL}/services/${serviceInfo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update service details.");
        }
        return response.json();
      })
      .then((service) => serviceSchema.parse(service)),

  deleteService: (serviceId: number): Promise<void> =>
    fetch(`${Global.baseURL}/services/${serviceId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete service.");
      }
      return response.json();
    }),

  getServiceFromServer: (serviceId: number): Promise<Service> =>
    Requests.fetchServices()
      .then((services) => {
        return services.find((service) => service.id === serviceId);
      })
      .then((service) => {
        if (!service) {
          throw new Error("Login failed.");
        }
        return service;
      }),

  getCurrentProviderServices: (currentUserId: number) =>
    Requests.fetchServices().then((allServices) =>
      allServices.filter(({ providerId }) => providerId === currentUserId)
    ),
};
