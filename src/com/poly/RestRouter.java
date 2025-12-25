package com.poly;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/persons")
public class RestRouter {
    
    private PersonServicee personService = new PersonServiceImpl();
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPersons() {
        List<Person> persons = personService.getAllPersons();
        return Response.ok(persons).build();
    }
    
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPerson(@PathParam("id") int id) {
        Person person = personService.getPerson(id);
        if (person != null) {
            return Response.ok(person).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Person not found\"}")
                    .build();
        }
    }
    
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addPerson(Person person) {
        boolean success = personService.addPerson(person);
        if (success) {
            return Response.status(Response.Status.CREATED)
                    .entity("{\"message\": \"Person added\"}")
                    .build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Failed to add\"}")
                    .build();
        }
    }
    
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePerson(@PathParam("id") int id, Person person) {
        person.setId(id);
        boolean success = personService.updatePerson(person);
        if (success) {
            return Response.ok("{\"message\": \"Person updated\"}").build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Failed to update\"}")
                    .build();
        }
    }
    
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePerson(@PathParam("id") int id) {
        boolean success = personService.deletePerson(id);
        if (success) {
            return Response.ok("{\"message\": \"Person deleted\"}").build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Failed to delete\"}")
                    .build();
        }
    }
}