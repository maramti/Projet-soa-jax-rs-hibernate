package com.poly;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

public class PersonServiceImpl implements PersonServicee {

    EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("persistence");
    EntityManager entityManager = entityManagerFactory.createEntityManager();

    @Override
    public List<Person> getAllPersons() {
        try {
            entityManager.getTransaction().begin();
            Query query = entityManager.createQuery("SELECT p FROM Person p");
            List<Person> listp = query.getResultList();
            
            if (listp == null || listp.isEmpty()) {
                System.out.println("No person found.");
            } else {
                for (Person person : listp) {
                    System.out.println(person.getName());
                }
            }
            
            entityManager.getTransaction().commit();
            return listp;
            
        } catch (Exception e) {
            e.printStackTrace();
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            return null;
        }
    }

    @Override 
    public boolean addPerson(Person p) {
        try {
            entityManager.getTransaction().begin();
            entityManager.persist(p);
            entityManager.getTransaction().commit();
            System.out.println("Record Successfully Inserted In The Database");
            return true;
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur add");
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            return false;
        }
    }

    @Override 
    public boolean deletePerson(int id) {
        try {
            entityManager.getTransaction().begin();
            Person person = entityManager.find(Person.class, id);
            if (person != null) {
                entityManager.remove(person);
            }
            entityManager.getTransaction().commit();
            System.out.println("Delete Successfully In The Database");
            return true;
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            return false;
        }
    }

    @Override
    public Person getPerson(int id) {
        try {
            entityManager.getTransaction().begin();
            Person person = entityManager.find(Person.class, id);
            entityManager.getTransaction().commit();
            return person;
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            return null;
        }
    }

    @Override
    public boolean updatePerson(Person p) {
        try {
            entityManager.getTransaction().begin();
            entityManager.merge(p);
            entityManager.getTransaction().commit();
            return true;
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur update");
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            return false;
        }
    }
    
    public void closeResources() {
        try {
            if (entityManager != null && entityManager.isOpen()) {
                entityManager.close();
            }
            if (entityManagerFactory != null && entityManagerFactory.isOpen()) {
                entityManagerFactory.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}