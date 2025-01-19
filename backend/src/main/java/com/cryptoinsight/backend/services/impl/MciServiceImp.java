package com.cryptoinsight.backend.services.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cryptoinsight.backend.repositories.facade.MciRepository;
import com.cryptoinsight.backend.services.facade.MciService;

import java.util.List;


@Service
public class MciServiceImp implements MciService {

        @Autowired
        private MciRepository MciRepository;

       
        @Override
        public List<Map<String, Object>> getMci(String token){
            return MciRepository.getMci(token);
        }


    
}