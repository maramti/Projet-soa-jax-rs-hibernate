package com.poly;

import java.util.List;

public interface PersonServicee {
    List<Person> getAllPersons();
    boolean addPerson(Person p);
    boolean deletePerson(int id);
    Person getPerson(int id);
    boolean updatePerson(Person p);
}