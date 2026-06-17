//package com.cpplatform;
//
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//
//@SpringBootApplication
//public class CpPlatformApplication {
//
//    public static void main(String[] args) {
//        SpringApplication.run(CpPlatformApplication.class, args);
//    }
//}
package com.cpplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // enables @Scheduled annotation to work
public class CpPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(CpPlatformApplication.class, args);
    }
}