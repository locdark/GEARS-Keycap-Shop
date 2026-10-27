package com.gears.patterns.observer;

import java.util.ArrayList;
import java.util.List;

/**
 * DESIGN PATTERN: OBSERVER
 * Chu the phat su kien (Subject / Observable).
 * Quan ly danh sach Observer va broadcast thong bao khi du lieu thay doi.
 */
public class Subject {
    private static Subject instance;
    private final List<IDataObserver> observers = new ArrayList<>();

    private Subject() {}

    public static synchronized Subject getInstance() {
        if (instance == null) {
            instance = new Subject();
        }
        return instance;
    }

    public synchronized void registerObserver(IDataObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public synchronized void removeObserver(IDataObserver observer) {
        observers.remove(observer);
    }

    public synchronized void notifyObservers(String eventType, Object data) {
        for (IDataObserver obs : new ArrayList<>(observers)) {
            try {
                obs.onDataChanged(eventType, data);
            } catch (Exception e) {
                System.err.println("Lỗi khi thông báo Observer: " + e.getMessage());
            }
        }
    }
}
