import { client } from "@/lib/config";
import { Generate_Video_Prompt, TESTING_VIDEO_SLIES } from "@/lib/constant";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


import { db } from "@/db";
import { chapterContentSlides } from "@/db/schema";
import { BlobServiceClient } from "@azure/storage-blob";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { chapter, courseId } = body;

        if (!chapter) {
            return NextResponse.json(
                { error: "Chapter data is required" },
                { status: 400 }
            );
        }

        const response = await client.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                { role: "system", content: Generate_Video_Prompt },
                { role: "user", content: `Chapter Details: ${JSON.stringify(chapter)}` },
            ],
        });

        const rawContent = response.choices?.[0]?.message?.content;

        if (!rawContent) {
            return NextResponse.json(
                { error: "Empty response from model" },
                { status: 500 }
            );
        }

        const cleanedContent = rawContent
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedContent = JSON.parse(cleanedContent);

        const videoContentJson = parsedContent;
        const audiFileUrl: string[] = [];
        for( let i = 0; i < videoContentJson.length; i++){
            
            const narration = videoContentJson[i].narration.fullText;
            const fondaRes  = await axios.post('https://api.fonada.ai/tts/generate-audio-large',{
                input:narration,
                voice:"Vaanee",
                Languages:'English',

            },{
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${process.env.FONADALAB_API_KEY}`
                },
                responseType:'arraybuffer',
                timeout:150000
            });

            const audioBuffer = Buffer.from(fondaRes.data);
            const audioUrl = await SaveAudioToStorage(audioBuffer,videoContentJson[i].audioFileName);
            audiFileUrl.push(audioUrl);;

        }
            await Promise.all(
                videoContentJson.map(async (s: any, id: number) => {
                  return await db.insert(chapterContentSlides).values({
                    chapterId: chapter.chapterId,
                      courseId: courseId,
                      slideIndex: videoContentJson[id].slideIndex,
                      slideId: videoContentJson[id].slideId,
                      audioFileName: videoContentJson[id].audioFileName,
                      narration: videoContentJson[id].narration,
                      revelData: videoContentJson[id].revelData,
                      html: videoContentJson[id].html,
                      audioFileUrl: audiFileUrl[id] ?? '' 
                  }).returning();
              })
          )

            const slidesWithAudio = videoContentJson.map((s: any, i: number) => ({
                            ...s,
                            audioFileUrl: audiFileUrl[i] ?? "",
                            }));
        return NextResponse.json({ slides: slidesWithAudio });
    } catch (error) {
        console.error("Video generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate video content" },
            { status: 500 }
        );
    }
}






const SaveAudioToStorage = async( audioBuffer:Buffer,fileName:string) =>{
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER;
  if (!conn) throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured");
  if (!containerName) throw new Error("AZURE_STORAGE_CONTAINER is not configured");
  const blobService = BlobServiceClient.fromConnectionString(conn);
  const container = blobService.getContainerClient(containerName);
  
  const cleanName = fileName.replace(/\.mp3$/, '');
  const blobName = `${cleanName}.mp3`;

  const blockBlob = container.getBlockBlobClient(blobName);
    
  await blockBlob.uploadData(audioBuffer,{
      blobHTTPHeaders:{
          blobContentType:"audio/mpeg",
          blobCacheControl:"public, max-age=32536000, immutable"
      }
  })
  const publicBase = process.env.AZURE_STORAGE_PUBLIC_BASE_URL; 
  const url = publicBase ? publicBase + "/" + container.containerName + "/" + blobName : blockBlob.url; 
  return url;
}