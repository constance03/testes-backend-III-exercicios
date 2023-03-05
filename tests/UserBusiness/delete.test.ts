import { UserBusiness } from "../../src/business/UserBusiness";
import { DeleteUserInputDTO } from "../../src/dtos/userDTO";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";

describe("delete", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deletar User", async () => {
    const input: DeleteUserInputDTO = {
      token: "token-mock-admin",
      idToDelete: "id-mock-normal",
    };

    const response = await userBusiness.deleteUser(input);
    expect(response).toBe(undefined);
  });

  test("token é string", async () => {
    expect.assertions(1);

    const input: DeleteUserInputDTO = {
      token: 2,
      idToDelete: "id-mock",
    };

    try {
      await userBusiness.deleteUser(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("requer token");
      }
    }
  });

  test("token invalido", async () => {
    expect.assertions(1);

    const input: DeleteUserInputDTO = {
      token: "iadoajeoifj",
      idToDelete: "id-mock",
    };

    try {
      await userBusiness.deleteUser(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("token inválido");
      }
    }
  });

  test("token diferente de admin", async () => {
    expect.assertions(1);

    const input: DeleteUserInputDTO = {
      token: "token-mock-normal",
      idToDelete: "id-mock",
    };

    try {
      await userBusiness.deleteUser(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("somente admins podem deletar contas");
      }
    }
  });

  test('id não existe', () => {
    const input: DeleteUserInputDTO = {
        token: "token-mock-admin",
        idToDelete: "eifheuhg",
      };

      expect(async () => {
        await userBusiness.deleteUser(input)
      }).rejects.toBeInstanceOf(NotFoundError);
  
  });

});
