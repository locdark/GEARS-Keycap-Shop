package com.gears.dao;

import com.gears.model.NhaCungCap;
import com.gears.patterns.singleton.DatabaseContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object cho NhaCungCap.
 */
public class NhaCungCapDAO implements IGenericDAO<NhaCungCap, String> {
    private final DatabaseContext db = DatabaseContext.getInstance();

    @Override
    public List<NhaCungCap> getAll() {
        return new ArrayList<>(db.getNhaCungCapMap().values());
    }

    @Override
    public NhaCungCap getById(String id) {
        return db.getNhaCungCapMap().get(id);
    }

    @Override
    public boolean insert(NhaCungCap ncc) {
        if (ncc == null) return false;
        if (ncc.getMaNCC() == null || ncc.getMaNCC().trim().isEmpty()) {
            int count = db.getNhaCungCapMap().size() + 1;
            ncc.setMaNCC(String.format("NCC%02d", count));
        }
        db.getNhaCungCapMap().put(ncc.getMaNCC(), ncc);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean update(NhaCungCap ncc) {
        if (ncc == null || !db.getNhaCungCapMap().containsKey(ncc.getMaNCC())) return false;
        db.getNhaCungCapMap().put(ncc.getMaNCC(), ncc);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean delete(String id) {
        if (!db.getNhaCungCapMap().containsKey(id)) return false;
        db.getNhaCungCapMap().remove(id);
        db.saveToDisk();
        return true;
    }
}
