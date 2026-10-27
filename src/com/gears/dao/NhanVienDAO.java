package com.gears.dao;

import com.gears.model.NhanVien;
import com.gears.patterns.singleton.DatabaseContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object cho NhanVien.
 */
public class NhanVienDAO implements IGenericDAO<NhanVien, String> {
    private final DatabaseContext db = DatabaseContext.getInstance();

    @Override
    public List<NhanVien> getAll() {
        return new ArrayList<>(db.getNhanVienMap().values());
    }

    @Override
    public NhanVien getById(String id) {
        return db.getNhanVienMap().get(id);
    }

    public NhanVien getByUsername(String username) {
        if (username == null) return null;
        for (NhanVien nv : db.getNhanVienMap().values()) {
            if (username.trim().equalsIgnoreCase(nv.getUsername())) {
                return nv;
            }
        }
        return null;
    }

    @Override
    public boolean insert(NhanVien nv) {
        if (nv == null) return false;
        if (nv.getId() == null || nv.getId().trim().isEmpty()) {
            int count = db.getNhanVienMap().size() + 1;
            nv.setId(String.format("NV%02d", count));
        }
        db.getNhanVienMap().put(nv.getId(), nv);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean update(NhanVien nv) {
        if (nv == null || !db.getNhanVienMap().containsKey(nv.getId())) return false;
        db.getNhanVienMap().put(nv.getId(), nv);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean delete(String id) {
        if (!db.getNhanVienMap().containsKey(id)) return false;
        db.getNhanVienMap().remove(id);
        db.saveToDisk();
        return true;
    }
}
