const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Upload e processamento de imagem
router.post('/process', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }

    const { clothingType } = req.body;
    if (!clothingType) {
      return res.status(400).json({ message: 'Tipo de roupa é obrigatório' });
    }

    // Verificar se usuário tem tokens
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.tokens <= 0) {
      return res.status(400).json({ message: 'Sem tokens disponíveis' });
    }

    // Consumir token
    User.consumeToken(req.user.id);

    // Preparar dados para API da Fashn.ai
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));
    formData.append('clothing_type', clothingType);

    // Chamar API da Fashn.ai
    const response = await axios.post('https://api.fashn.ai/process', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY_FASHN}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Salvar imagem processada
    const processedImagePath = path.join(__dirname, '../uploads', `processed-${req.file.filename}`);
    fs.writeFileSync(processedImagePath, response.data);

    // Limpar arquivo temporário
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Imagem processada com sucesso',
      processedImageUrl: `/uploads/processed-${req.file.filename}`,
      tokensRemaining: user.tokens - 1
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    
    // Limpar arquivo temporário em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: 'Erro ao processar imagem',
      error: error.message 
    });
  }
});

// Simular processamento (para teste sem API real)
router.post('/process-mock', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }

    const { clothingType } = req.body;
    if (!clothingType) {
      return res.status(400).json({ message: 'Tipo de roupa é obrigatório' });
    }

    // Verificar se usuário tem tokens
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.tokens <= 0) {
      return res.status(400).json({ message: 'Sem tokens disponíveis' });
    }

    // Consumir token
    const updatedUser = User.consumeToken(req.user.id);

    // Simular processamento (copiar arquivo)
    const processedImagePath = path.join(__dirname, '../uploads', `processed-${req.file.filename}`);
    fs.copyFileSync(req.file.path, processedImagePath);

    res.json({
      message: 'Imagem processada com sucesso (modo simulação)',
      originalImageUrl: `/uploads/${req.file.filename}`,
      processedImageUrl: `/uploads/processed-${req.file.filename}`,
      tokensRemaining: updatedUser.tokens,
      clothingType
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    
    // Limpar arquivo temporário em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: 'Erro ao processar imagem',
      error: error.message 
    });
  }
});

// Processamento de duas imagens (pessoa + roupa) com Fashn.ai
router.post('/process-two-images', authenticateToken, upload.fields([
  { name: 'personImage', maxCount: 1 },
  { name: 'clothingImage', maxCount: 1 }
]), async (req, res) => {
  console.log('Endpoint /process-two-images chamado');
  try {
    if (!req.files.personImage || !req.files.clothingImage) {
      return res.status(400).json({ message: 'É necessário enviar uma foto da pessoa e uma da roupa' });
    }

    // Verificar se usuário tem tokens
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.tokens < 25) {
      return res.status(400).json({ message: 'Tokens insuficientes. Necessário: 25 tokens. Disponível: ' + user.tokens + ' tokens' });
    }

    // Consumir tokens ANTES do processamento
    const updatedUser = User.consumeToken(req.user.id);

    const personFile = req.files.personImage[0];
    const clothingFile = req.files.clothingImage[0];

    console.log('Iniciando processamento com Fashn.ai...');
    console.log('Pessoa:', personFile.filename);
    console.log('Roupa:', clothingFile.filename);

    // Converter imagens para base64
    const personImageBase64 = fs.readFileSync(personFile.path, 'base64');
    const clothingImageBase64 = fs.readFileSync(clothingFile.path, 'base64');

    // Preparar dados para API da Fashn.ai (formato atualizado)
    const requestData = {
      model_name: 'tryon-v1.6',
      inputs: {
        model_image: `data:image/jpeg;base64,${personImageBase64}`,
        garment_image: `data:image/jpeg;base64,${clothingImageBase64}`
      }
    };

    console.log('Enviando requisição para Fashn.ai...');

    // Chamar API da Fashn.ai
    const response = await axios.post('https://api.fashn.ai/v1/run', requestData, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY_FASHN}`,
        'Content-Type': 'application/json'
      }
    });

    const predictionId = response.data.id;
    console.log('Prediction ID:', predictionId);

    // Fazer polling para verificar status
    let attempts = 0;
    const maxAttempts = 30; // 5 minutos máximo
    let status = 'starting';

    while (attempts < maxAttempts && status !== 'completed' && status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Aguardar 10 segundos
      
      try {
        const statusResponse = await axios.get(`https://api.fashn.ai/v1/status/${predictionId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.API_KEY_FASHN}`
          }
        });
        
        status = statusResponse.data.status;
        console.log(`Tentativa ${attempts + 1}: Status = ${status}`);
        console.log('Resposta completa do status:', JSON.stringify(statusResponse.data, null, 2));
        attempts++;
      } catch (statusError) {
        console.error('Erro ao verificar status:', statusError.message);
        attempts++;
      }
    }

    if (status === 'completed') {
      // Tentar diferentes abordagens para obter o resultado
      let resultData;
      
      try {
        // Primeiro, verificar se o resultado está na resposta de status
        const finalStatusResponse = await axios.get(`https://api.fashn.ai/v1/status/${predictionId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.API_KEY_FASHN}`
          }
        });
        
        console.log('Resposta final do status:', JSON.stringify(finalStatusResponse.data, null, 2));
        
        // Verificar se há URL de resultado na resposta
        if (finalStatusResponse.data.output && finalStatusResponse.data.output.length > 0) {
          console.log('Baixando resultado da URL:', finalStatusResponse.data.output[0]);
          const resultResponse = await axios.get(finalStatusResponse.data.output[0], {
            responseType: 'arraybuffer'
          });
          resultData = resultResponse.data;
        } else if (finalStatusResponse.data.result_url) {
          console.log('Baixando resultado da URL:', finalStatusResponse.data.result_url);
          const resultResponse = await axios.get(finalStatusResponse.data.result_url, {
            responseType: 'arraybuffer'
          });
          resultData = resultResponse.data;
        } else if (finalStatusResponse.data.result) {
          // Se o resultado está em base64 na resposta
          console.log('Resultado encontrado em base64 na resposta');
          const base64Data = finalStatusResponse.data.result.replace(/^data:image\/[a-z]+;base64,/, '');
          resultData = Buffer.from(base64Data, 'base64');
        } else {
          // Tentar endpoints de download
          console.log('Tentando baixar resultado via endpoints...');
          
          const endpoints = [
            `/v1/output/${predictionId}`,
            `/v1/result/${predictionId}`,
            `/v1/download/${predictionId}`,
            `/v1/images/${predictionId}`
          ];
          
          let lastError;
          for (const endpoint of endpoints) {
            try {
              console.log(`Tentando endpoint: ${endpoint}`);
              const resultResponse = await axios.get(`https://api.fashn.ai${endpoint}`, {
                headers: {
                  'Authorization': `Bearer ${process.env.API_KEY_FASHN}`
                },
                responseType: 'arraybuffer'
              });
              resultData = resultResponse.data;
              console.log(`Sucesso com endpoint: ${endpoint}`);
              break;
            } catch (error) {
              console.log(`Falha com endpoint ${endpoint}: ${error.response?.status}`);
              lastError = error;
            }
          }
          
          if (!resultData) {
            throw lastError || new Error('Nenhum endpoint funcionou para baixar o resultado');
          }
        }
      } catch (error) {
        console.error('Erro ao obter resultado:', error.message);
        throw error;
      }

      // Salvar imagem processada
      const processedImagePath = path.join(__dirname, '../uploads', `processed-${personFile.filename}`);
      fs.writeFileSync(processedImagePath, resultData);

      // Limpar arquivos temporários
      fs.unlinkSync(personFile.path);
      fs.unlinkSync(clothingFile.path);

      console.log('Processamento concluído com sucesso!');

      res.json({
        message: 'Imagens processadas com sucesso!',
        processedImageUrl: `/uploads/processed-${personFile.filename}`,
        tokensRemaining: updatedUser.tokens,
        predictionId: predictionId
      });

    } else if (status === 'failed') {
      throw new Error('Processamento falhou na Fashn.ai');
    } else {
      throw new Error('Timeout: Processamento demorou muito para ser concluído');
    }

  } catch (error) {
    console.error('Erro no processamento de duas imagens:', error);
    
    // Limpar arquivos temporários em caso de erro
    if (req.files) {
      if (req.files.personImage && req.files.personImage[0] && fs.existsSync(req.files.personImage[0].path)) {
        fs.unlinkSync(req.files.personImage[0].path);
      }
      if (req.files.clothingImage && req.files.clothingImage[0] && fs.existsSync(req.files.clothingImage[0].path)) {
        fs.unlinkSync(req.files.clothingImage[0].path);
      }
    }

    res.status(500).json({ 
      message: 'Erro ao processar imagens',
      error: error.message 
    });
  }
});

module.exports = router;
