package com.gears.dao;

import com.gears.model.DonHang;
import com.gears.patterns.singleton.DatabaseContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object cho DonHang.
 */
public class DonHangDAO implements IGenericDAO<DonHang, String> {
    private final DatabaseContext db = DatabaseContext.getInstance();

    @Override
    public List<DonHang> getAll() {
        return new ArrayList<>(db.getDonHangMap().values());
    }

    @Override
    public DonHang getById(String id) {
        return db.getDonHangMap().get(id);
    }

    @Override
    public boolean insert(DonHang dh) {
        if (dh == null) return false;
        if (dh.getMaDH() == null || dh.getMaDH().trim().isEmpty()) {
            dh.setMaDH("DH-" + System.currentTimeMillis() % 100000);
        }
        db.getDonHangMap().put(dh.getMaDH(), dh);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean update(DonHang dh) {
        if (dh == null || !db.getDonHangMap().containsKey(dh.getMaDH())) return false;
        db.getDonHangMap().put(dh.getMaDH(), dh);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean delete(String id) {
        if (!db.getDonHangMap().containsKey(id)) return false;
        db.getDonHangMap().remove(id);
        db.saveToDisk();
        return true;
    }
}
