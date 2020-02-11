import { AfterRoutesInit, BeforeRoutesInit, Configuration, ExpressApplication, Inject, Service } from "@tsed/common";
import * as Passport from "passport";
import { Strategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { compareSync } from "bcryptjs"
import { NotFound } from "ts-httpexceptions";
import { UsersService } from "../services/user/user-service";
import tokenHelper from "../utils/token-helper";

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {
    constructor(private userService: UsersService,
        @Configuration() private configuration: Configuration,
        @Inject(ExpressApplication) private expressApplication: ExpressApplication
    ) {
        Passport.serializeUser(PassportLocalService.serialize);
    }

    static serialize(user, done) {
        done(null, user);
    }

    $beforeRoutesInit() {
        const options: any = this.configuration.get("passport") || {} as any;
        const { userProperty } = options;

        this.expressApplication.use(Passport.initialize({ userProperty }));
    }

    $afterRoutesInit() {
        this.initializeLogin();
        this.initializeVerify();
        this.initializeMemberLogin();
    }

    public initializeLogin() {
        console.log("login initial>>>>>>>>>>>>>>>>>>>>>>");

        Passport.use("login", new Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, username, password, done) => {
            this.login(username, password)
                .then((user) => done(null, user))
                .catch((err) => done(err));
        }));
    }

    public initializeMemberLogin() {
        Passport.use("memberLogin", new Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "mobileNumber",
            passwordField: "confirmCode",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, mobileNumber, confirmCode, done) => {
            this.memberLogin(mobileNumber, confirmCode)
                .then((user) => done(null, user))
                .catch((err) => done(err));
        }));
    }

    public initializeVerify() {
        Passport.use("verify", new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: tokenHelper.secretOrPrivateKey.toString()
        }, (jwt_payload, done) => {
            this.verify(jwt_payload.userId, jwt_payload.extraData)
                .then((data) => done(null, data))
                .catch((err) => done(err));
        }));
    }

    async login(username: string, password: string): Promise<Object> {
        try {
            console.log("in login", username, password);

            const user = await this.userService.getUserById(username);


            if (user && password === user.password) {
                // user.lastLoginDate = new Date();
                await this.userService.create(user);
                const token = tokenHelper.generateToken(user);

                return { token, ...user };
            }
            else {
                throw new NotFound("UNAUTHORIZED123123");

            }


        } catch (e) {
            throw new NotFound("INTERNAL_SERVER_ERROR123123");
        }
    }



    async verify(userId: number, extraData: any): Promise<Object> {
        try {
            const user = await this.userService.getUserById(userId.toString());
            if (user) {
                const data = { user, extraData };

                return data;
            } else {
                return null;
            }

        } catch (e) {
            console.error(e);
            throw new NotFound("error");
        }
    }

    async memberLogin(username: string, password: string): Promise<Object> {
        try {
            const user = await this.userService.getUserById(username);
            if (user && password === user.password) {
                await this.userService.create(user);
                const token = tokenHelper.generateToken(user, {});

                return { token, ...user };
            }

            throw new NotFound("User not found");
        } catch (e) {
            console.error(e);
            throw new NotFound("User not found");
        }
    }
}