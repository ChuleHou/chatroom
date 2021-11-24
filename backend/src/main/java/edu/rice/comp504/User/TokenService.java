package edu.rice.comp504.User;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

public class TokenService {
    public static String getToken(String name, String pwd) {
        Date start = new Date();
        long currentTime = System.currentTimeMillis() + 60* 60 * 1000;//one hour valid
        Date end = new Date(currentTime);
        String token = "";

        try {
            token = JWT.create().withAudience(name).withIssuedAt(start).withExpiresAt(end)
                    .sign(Algorithm.HMAC256(pwd));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return token;
    }
}
