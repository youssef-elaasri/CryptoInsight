package com.cryptoinsight.backend.repositories.facade;

import com.cryptoinsight.backend.models.Coin;
import com.influxdb.query.FluxTable;

import java.util.List;
import java.util.Map;

public interface MciRepository {
    
   public List<Map<String, Object>> getMci(String token) ;

}
