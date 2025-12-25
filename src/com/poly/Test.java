package com.poly;

public class Test {
	public static void main(String[]args) {
	PersonService ps = new PersonService();
	Person p = new Person(30,"maram");
	ps.addPerson(p);
	ps.entityManager.close();
	ps.entityManagerFactory.close();
	
	}
}
