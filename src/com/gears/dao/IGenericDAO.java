package com.gears.dao;

import java.util.List;

/**
 * Giao dien Generic DAO - Mau kien truc chuan PTTKHDT cho tang Data Access Object.
 * @param <T> Loai thuc the Entity
 * @param <ID> Kieu khoa chinh Primary Key
 */
public interface IGenericDAO<T, ID> {
    List<T> getAll();
    T getById(ID id);
    boolean insert(T entity);
    boolean update(T entity);
    boolean delete(ID id);
}
