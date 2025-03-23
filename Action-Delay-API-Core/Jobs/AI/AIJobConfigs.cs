using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Unicode;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.CloudflareAPI.AI;
using Action_Delay_API_Core.Models.Local;
using Microsoft.Extensions.Options;
using NAudio.Wave;
using SkiaSharp;

namespace Action_Delay_API_Core.Jobs.AI
{

    public interface IAIJobConfigs
    {
        AIJobConfig? GetConfig(AIGetModelsResponse.AIGetModelsResponseDTO model);
    }

    public class AIJobConfigs : IAIJobConfigs
    {
        private byte[] _sampleImage;
        private byte[] _sampleAudio;
        public AIJobConfigs(IOptions<LocalConfig> config)
        {
            if (config.Value.AI == null || config.Value.AI.Enabled == false)
                return;
            if (File.Exists("Resources/sampleaudio.wav"))
            {
                _sampleAudio = File.ReadAllBytes("Resources/sampleaudio.wav");

            }
            else
            {
                _sampleAudio = File.ReadAllBytes("sampleaudio.wav");
            }

            if (File.Exists("Resources/sampleimage.jpg"))
            {
                _sampleImage = File.ReadAllBytes("Resources/sampleimage.jpg");

            }
            else
            {
                _sampleImage = File.ReadAllBytes("sampleimage.jpg");
            }
        }

 

        public AIJobConfig? GetConfig(AIGetModelsResponse.AIGetModelsResponseDTO model)
        {
            if (model.Properties != null)
                foreach (var modelProperty in model.Properties)
                {
                    if (modelProperty.PropertyId.Equals("private", StringComparison.OrdinalIgnoreCase))
                    {
                        if (modelProperty.Value.Equals("true", StringComparison.OrdinalIgnoreCase))
                        {
                            return null;
                        }
                    }
                }



            // NOT SUREIF THESE WILL CHANGE CATEGORIES SO

            if (model.Name.Equals("@cf/meta/llama-3.2-11b-vision-instruct", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("2cbc033b-ded8-4e02-bbb2-47cf05d5cfe5", StringComparison.Ordinal))
            {
                return new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "raw",
                    InputField = "n/a",
                    OutputType = "json",
                    ContentStr = (System.Text.Json.JsonSerializer.Serialize(new
                    {
                        prompt = GetImageGenText(),
                        image = $"$base64touint8array:{(Convert.ToBase64String(GetNewImage()))}"
                    })),
                };
            }

            if (model.Name.Equals("@cf/myshell-ai/melotts", StringComparison.OrdinalIgnoreCase)) // idk GUID!!!
            {
                return new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "text",
                    InputField = "prompt",
                    OutputType = "JsonCheckFieldStr",
                    OutputTypeCheck = "audio",
                    ContentStr = GetText(),
                };
            }

            if (model.Name.Trim().Equals("@cf/openai/whisper-large-v3-turbo", StringComparison.OrdinalIgnoreCase) ||
                model.Id.Equals("200f0812-148c-48c1-915d-fb3277a94a08", StringComparison.Ordinal))
            {
                return new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "text",
                    InputField = "audio",
                    OutputType = "json",
                    ContentStr = Convert.ToBase64String(GetNewAudio()),
                };
            }


            if (model.Name.Equals("@cf/meta/llama-guard-3-8b",
                    StringComparison.OrdinalIgnoreCase) || model.Id.Equals("cc80437b-9a8d-4f1a-9c77-9aaf0d226922",
                    StringComparison.OrdinalIgnoreCase))
            {
                var newConfig = new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "raw",
                    InputField = "n/a",
                    OutputType = "json",
                };


                newConfig.ContentStr = System.Text.Json.JsonSerializer.Serialize(new MessagePrompt()
                {
                    Messages =
                    [
                        new Message()
                        {
                            Role = "user",
                            Content = GetText()
                        }
                    ]
                });
                return newConfig;
            }




            // Automatic Speech Recognition / dfce1c48-2a81-462e-a7fd-de97ce985207 
            if (model.Task.Name.Equals("Automatic Speech Recognition", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("dfce1c48-2a81-462e-a7fd-de97ce985207", StringComparison.Ordinal))
            {
                
                    // global for now
                    return new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "uint8array",
                    InputField = "audio",
                    OutputType = "json",
                    Content = GetNewAudio(),
                };
            }
            // Image Classification / 00cd182b-bf30-4fc4-8481-84a3ab349657
            else if (model.Task.Name.Equals("Image Classification", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("00cd182b-bf30-4fc4-8481-84a3ab349657", StringComparison.Ordinal))
            {
                // 
                if (model.Name.Equals("@cf/microsoft/resnet-50", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("7f9a76e1-d120-48dd-a565-101d328bbb02", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "uint8array",
                        InputField = "image",
                        OutputType = "json",
                        Content = GetNewImage(),
                    };
                }
                // no fallback for this type.
            }
            // Image-to-Text / 882a91d1-c331-4eec-bdad-834c919942a8
            else if (model.Task.Name.Equals("Image-to-Text", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("882a91d1-c331-4eec-bdad-834c919942a8", StringComparison.Ordinal))
            {
                // 
                if ((model.Name.Equals("@cf/unum/uform-gen2-qwen-500m", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("3dca5889-db3e-4973-aa0c-3a4a6bd22d29", StringComparison.Ordinal)) ||
                    (model.Name.Equals("@cf/llava-hf/llava-1.5-7b-hf", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("3dca5889-db3e-4973-aa0c-3a4a6bd22d29", StringComparison.Ordinal)))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "uint8array",
                        InputField = "image",
                        OutputType = "json",
                        Content = GetNewImage(),
                    };
                }
                // no fallback for this type.
            }
            // Object Detection / 9c178979-90d9-49d8-9e2c-0f1cf01815d4
            else if (model.Task.Name.Equals("Object Detection", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("9c178979-90d9-49d8-9e2c-0f1cf01815d4", StringComparison.Ordinal))
            {
                // 
                if (model.Name.Equals("@cf/facebook/detr-resnet-50", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("cc34ce52-3059-415f-9a48-12aa919d37ee", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "uint8array",
                        InputField = "image",
                        OutputType = "json",
                        Content = GetNewImage(),
                    };
                }
                // no fallback for this type.
            }
            // Summarization / 6f4e65d8-da0f-40d2-9aa4-db582a5a04fd
            else if (model.Task.Name.Equals("Summarization", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("6f4e65d8-da0f-40d2-9aa4-db582a5a04fd", StringComparison.Ordinal))
            {
                // 
                if (model.Name.Equals("@cf/facebook/bart-large-cnn", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("19bd38eb-bcda-4e53-bec2-704b4689b43a", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "text",
                        InputField = "input_text",
                        OutputType = "json",
                        ContentStr = GetText(),
                    };
                }
                // no fallback for this type.
            }
            // Text Classification / 19606750-23ed-4371-aab2-c20349b53a60
            else if (model.Task.Name.Equals("Text Classification", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("19606750-23ed-4371-aab2-c20349b53a60", StringComparison.Ordinal))
            {
                // 
                if (model.Name.Equals("@cf/huggingface/distilbert-sst-2-int8", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("eaf31752-a074-441f-8b70-d593255d2811", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "text",
                        InputField = "text",
                        OutputType = "json",
                        ContentStr = GetText(),
                    };
                }
                // no fallback for this type.
            }

            // Text Embeddings / 0137cdcf-162a-4108-94f2-1ca59e8c65ee 
            else if (model.Task.Name.Equals("Text Embeddings", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("0137cdcf-162a-4108-94f2-1ca59e8c65ee", StringComparison.Ordinal))
            {
                return new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "text",
                    InputField = "text",
                    OutputType = "json",
                    ContentStr = GetText(),
                };
            }
            // ​​
            // Text Generation / c329a1f9-323d-4e91-b2aa-582dd4188d34 
            else if (model.Task.Name.Equals("Text Generation", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("c329a1f9-323d-4e91-b2aa-582dd4188d34", StringComparison.Ordinal))
            {
                var newConfig = new AIJobConfig()
                {
                    ModelName = model.Name,
                    Input = "raw",
                    InputField = "n/a",
                    OutputType = "buffereventstream",
                    
                };
                var question = "";
                /*
                if (model.Name.Equals("@hf/thebloke/llamaguard-7b-awq", StringComparison.OrdinalIgnoreCase))
                {
                    newConfig.ContentStr = "[INST] " + GetText() + " [/INST]";
                }
                */
                if (model.Name.StartsWith("@cf/deepseek-ai/deepseek-math", StringComparison.OrdinalIgnoreCase))
                {
                    question = $"Why is 1/0 not 0? Please explain to me in much detail as humanly possible. Or why {Random.Shared.NextInt64()}/0 isn't 0.";
                }
                else if (model.Name.Equals("@cf/defog/sqlcoder-7b-2", StringComparison.OrdinalIgnoreCase))
                {
                    question =
                        $"My table is like this: Key, Data1, Data2, Data3,...Data{Random.Shared.NextInt64()}, Groupby. Select all Data up 500 grouping by Groupby limiting by 17 and where every other data does not contain cookies.";
                }
                else
                {
                    question = GetText();
                }



                newConfig.ContentStr = System.Text.Json.JsonSerializer.Serialize(new MessagePrompt()
                {
                    Messages = new Message[]
                    {
                        new Message()
                        {
                            Role = "system",
                            Content = "you are a computer science assistant who likes to ramble"
                        },
                        new Message()
                        {
                            Role = "user",
                            Content = question
                        }
                    }
                });
                return newConfig;
            }
            // Text-to-Image / 3d6e1f35-341b-4915-a6c8-9a7142a9033a
            else if (model.Task.Name.Equals("Text-to-Image", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("3d6e1f35-341b-4915-a6c8-9a7142a9033a", StringComparison.Ordinal))
            {
                // 
                if ((model.Name.Equals("@cf/lykon/dreamshaper-8-lcm", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("7912c0ab-542e-44b9-b9ee-3113d226a8b5", StringComparison.Ordinal)) ||
                    (model.Name.Equals("@cf/bytedance/stable-diffusion-xl-lightning", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("7f797b20-3eb0-44fd-b571-6cbbaa3c423b", StringComparison.Ordinal)) ||
                    (model.Name.Equals("@cf/stabilityai/stable-diffusion-xl-base-1.0", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("6d52253a-b731-4a03-b203-cde2d4fae871", StringComparison.Ordinal)))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "text",
                        InputField = "prompt",
                        OutputType = "json",
                        ContentStr = GetText(),
                    };
                }
           
                else if (model.Name.Equals("@cf/runwayml/stable-diffusion-v1-5-img2img", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("19547f04-7a6a-4f87-bf2c-f5e32fb12dc5", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "raw",
                        InputField = "n/a",
                        OutputType = "json",
                        ContentStr = (System.Text.Json.JsonSerializer.Serialize(new
                        {
                            prompt = GetImageGenText(),
                            image = $"$base64touint8array:{(Convert.ToBase64String(GetNewImage()))}"
                        })),
                    };
                }
                else if (model.Name.Equals("@cf/runwayml/stable-diffusion-v1-5-inpainting", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("a9abaef0-3031-47ad-8790-d311d8684c6c", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "raw",
                        InputField = "n/a",
                        OutputType = "json",
                        ContentStr = System.Text.Json.JsonSerializer.Serialize(new
                        {
                            prompt = GetImageGenText(),
                            image = $"$base64touint8array:{Convert.ToBase64String(GetNewImage())}",
                            mask = $"$base64touint8array:{Convert.ToBase64String(GetNewImage())}"
                        }),
                    };
                }
                else if ((model.Name.Equals("@cf/black-forest-labs/flux-1-schnell",
                              StringComparison.OrdinalIgnoreCase) ||
                          model.Id.Equals("9e087485-23dc-47fa-997d-f5bfafc0c7cc", StringComparison.Ordinal)))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "text",
                        InputField = "prompt",
                        OutputType = "JsonCheckFieldStr",
                        OutputTypeCheck = "image",
                        ContentStr = GetText(),
                    };
                }
                // no fallback for this type.
            }
            // Translation / f57d07cb-9087-487a-bbbf-bc3e17fecc4b
            else if (model.Task.Name.Equals("Translation", StringComparison.OrdinalIgnoreCase) || model.Task.Id.Equals("f57d07cb-9087-487a-bbbf-bc3e17fecc4b", StringComparison.Ordinal))
            {
                // 
                if (model.Name.Equals("@cf/meta/m2m100-1.2b", StringComparison.OrdinalIgnoreCase) || model.Id.Equals("617e7ec3-bf8d-4088-a863-4f89582d91b5", StringComparison.Ordinal))
                {
                    return new AIJobConfig()
                    {
                        ModelName = model.Name,
                        Input = "raw",
                        InputField = "n/a",
                        OutputType = "json",
                        ContentStr = (System.Text.Json.JsonSerializer.Serialize(new
                        {
                          text = GetText(),
                          source_lang = "english",
                          target_lang = "spanish",
                        })),
                    };
                }
                // no fallback for this type.
            }


            return null;
        }

        public partial class MessagePrompt
        {
            [JsonPropertyName("messages")]
            public Message[] Messages { get; set; }
        }

        public partial class Message
        {
            [JsonPropertyName("role")]
            public string Role { get; set; }

            [JsonPropertyName("content")]
            public string Content { get; set; }
        }

        public string GetImageGenText()
        {
            return $"Please generate an image with the current timestamp: {DateTime.UtcNow.ToString("G")}";
        }
        public string GetText()
        {
            return $"Hello from Action-Delay-Api AI tests. The current time is {DateTime.UtcNow.ToString("G")}. Please explain in much detail how computers work." ;
        }
     
        public byte[] GetNewImage()
        {
            using var inputImage = SKBitmap.Decode(_sampleImage); // Load the image

            Random rand = new Random();

            //Iterate over the pixels
            for (int y = 0; y < inputImage.Height; y++)
            {
                for (int x = 0; x < inputImage.Width; x++)
                {
                    // Get the current pixel color
                    var oldColor = inputImage.GetPixel(x, y);

                    // Create noise
                    var noise = new SKColor((byte)rand.Next(256),
                        (byte)rand.Next(256),
                        (byte)rand.Next(256));

                    // Add noise to the old color (with a 5% factor to not distort the image too much)
                    var newColor = new SKColor((byte)(oldColor.Red * 0.95f + noise.Red * 0.05f),
                        (byte)(oldColor.Green * 0.95f + noise.Green * 0.05f),
                        (byte)(oldColor.Blue * 0.95f + noise.Blue * 0.05f));

                    // Set new pixel color to the image
                    inputImage.SetPixel(x, y, newColor);
                }
            }

            using var data = inputImage.Encode(SKEncodedImageFormat.Jpeg, 80);
            return data.ToArray();
        }

        public byte[] GetNewAudio()
        {
            using (WaveStream stream = new RawSourceWaveStream(new MemoryStream(_sampleAudio), new WaveFormat()))
            using (WaveFileReader reader = new WaveFileReader(stream))
            {
                int byteDepth = reader.WaveFormat.BitsPerSample / 8;
                var buffer = new byte[reader.Length];
                int read = reader.Read(buffer, 0, buffer.Length);
                var rnd = new Random();

                for (int i = 0; i < read; i += byteDepth)
                {
                    short amplitude = BitConverter.ToInt16(buffer, i);
                    short noise = (short)rnd.Next(-1, 2);
                    short withNoise = (short)(amplitude + short.MaxValue * 0.01 * noise);

                    byte[] withNoiseBytes = BitConverter.GetBytes(withNoise);

                    // Write the noise-added data back into the buffer
                    for (int b = 0; b < byteDepth; b++)
                    {
                        if ((i + b) < buffer.Length)
                        {
                            buffer[i + b] = withNoiseBytes[b];
                        }
                    }
                }

                using (var ms = new MemoryStream())
                using (WaveFileWriter writer = new WaveFileWriter(ms, reader.WaveFormat))
                {
                    writer.Write(buffer, 0, read);
                    return ms.ToArray();
                }
            }
        }
    }

    public class AIJobConfig
    {
        public string? ContentStr
        {
            set => Content = Encoding.UTF8.GetBytes(value);
        }

        public byte[]? Content { get; set; }

        public string ModelName { get; set; }

        public string Input { get; set; }

        public string InputField { get; set; }

        public string OutputType { get; set; }

        public string OutputTypeCheck { get; set; }

        public int? MaxTokens { get; set; } = 100;


    }


}
