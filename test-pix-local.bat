@echo off
echo ============================================
echo    TESTE PIX LOCAL - Borracha de Roupa
echo ============================================
echo.
echo 1. Verifique se o backend esta rodando em http://localhost:5000
echo 2. Este script vai testar a geracao de PIX
echo.
pause

curl -X POST http://localhost:5000/api/payment/create ^
  -H "Content-Type: application/json" ^
  -d "{\"amount\":2000,\"payment_method\":\"pix\",\"customer\":{\"name\":\"Teste Local\",\"email\":\"teste@teste.com\",\"phone_number\":\"(11) 99999-9999\",\"document\":\"12345678900\",\"street_name\":\"Digital\",\"number\":\"N/A\",\"complement\":\"\",\"neighborhood\":\"Digital\",\"city\":\"Digital\",\"state\":\"SP\",\"zip_code\":\"00000000\"},\"cart\":[{\"product_hash\":\"tokens_5\",\"title\":\"50 Tokens\",\"cover\":null,\"price\":2000,\"quantity\":1,\"operation_type\":1,\"tangible\":false}],\"installments\":1,\"expire_in_days\":1,\"postback_url\":\"http://localhost:5000/api/payment/webhook\"}"

echo.
echo.
echo ============================================
echo Se aparecer "offer_hash obrigatorio", o backend nao foi reiniciado!
echo ============================================
pause

