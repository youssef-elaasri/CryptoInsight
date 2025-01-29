package com.cryptoinsight.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest("spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration")
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
