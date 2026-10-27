package com.gears.dao;

import com.gears.model.SanPhamKeycap;
import com.gears.patterns.singleton.DatabaseContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object cho SanPhamKeycap.
 */
public class SanPhamDAO implements IGenericDAO<SanPhamKeycap, Integer> {
    private final DatabaseContext db = DatabaseContext.getInstance();

    @Override
    public List<SanPhamKeycap> getAll() {
        return new ArrayList<>(db.getSanPhamMap().values());
    }

    @Override
    public SanPhamKeycap getById(Integer id) {
        return db.getSanPhamMap().get(id);
    }

    @Override
    public boolean insert(SanPhamKeycap sp) {
        if (sp == null) return false;
        if (sp.getMaSP() <= 0) {
            int nextId = db.getSanPhamMap().keySet().stream().max(Integer::compareTo).orElse(0) + 1;
            sp.setMaSP(nextId);
        }
        db.getSanPhamMap().put(sp.getMaSP(), sp);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean update(SanPhamKeycap sp) {
        if (sp == null || !db.getSanPhamMap().containsKey(sp.getMaSP())) return false;
        db.getSanPhamMap().put(sp.getMaSP(), sp);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean delete(Integer id) {
        if (!db.getSanPhamMap().containsKey(id)) return false;
        db.getSanPhamMap().remove(id);
        db.saveToDisk();
        return true;
    }

    public List<SanPhamKeycap> getByTheLoai(String theLoai) {
        List<SanPhamKeycap> result = new ArrayList<>();
        for (SanPhamKeycap sp : db.getSanPhamMap().values()) {
            if ("Tất cả".equalsIgnoreCase(theLoai) || sp.getTheLoai().equalsIgnoreCase(theLoai)) {
                result.add(sp);
            }
        }
        return result;
    }
}
