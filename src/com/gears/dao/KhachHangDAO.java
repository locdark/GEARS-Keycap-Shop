package com.gears.dao;

import com.gears.model.KhachHang;
import com.gears.patterns.singleton.DatabaseContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object cho KhachHang.
 */
public class KhachHangDAO implements IGenericDAO<KhachHang, String> {
    private final DatabaseContext db = DatabaseContext.getInstance();

    @Override
    public List<KhachHang> getAll() {
        return new ArrayList<>(db.getKhachHangMap().values());
    }

    @Override
    public KhachHang getById(String id) {
        return db.getKhachHangMap().get(id);
    }

    @Override
    public boolean insert(KhachHang kh) {
        if (kh == null) return false;
        if (kh.getId() == null || kh.getId().trim().isEmpty()) {
            int count = db.getKhachHangMap().size() + 1;
            kh.setId(String.format("KH%02d", count));
        }
        db.getKhachHangMap().put(kh.getId(), kh);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean update(KhachHang kh) {
        if (kh == null || !db.getKhachHangMap().containsKey(kh.getId())) return false;
        db.getKhachHangMap().put(kh.getId(), kh);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean delete(String id) {
        if (!db.getKhachHangMap().containsKey(id)) return false;
        db.getKhachHangMap().remove(id);
        db.saveToDisk();
        return true;
    }
}
