package com.gears.dao;

import com.gears.model.BaoCao;
import com.gears.patterns.singleton.DatabaseContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object cho BaoCao.
 */
public class BaoCaoDAO implements IGenericDAO<BaoCao, String> {
    private final DatabaseContext db = DatabaseContext.getInstance();

    @Override
    public List<BaoCao> getAll() {
        return new ArrayList<>(db.getBaoCaoMap().values());
    }

    @Override
    public BaoCao getById(String id) {
        return db.getBaoCaoMap().get(id);
    }

    @Override
    public boolean insert(BaoCao bc) {
        if (bc == null) return false;
        if (bc.getMaBC() == null || bc.getMaBC().trim().isEmpty()) {
            bc.setMaBC("BC-" + System.currentTimeMillis() % 100000);
        }
        db.getBaoCaoMap().put(bc.getMaBC(), bc);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean update(BaoCao bc) {
        if (bc == null || !db.getBaoCaoMap().containsKey(bc.getMaBC())) return false;
        db.getBaoCaoMap().put(bc.getMaBC(), bc);
        db.saveToDisk();
        return true;
    }

    @Override
    public boolean delete(String id) {
        if (!db.getBaoCaoMap().containsKey(id)) return false;
        db.getBaoCaoMap().remove(id);
        db.saveToDisk();
        return true;
    }
}
