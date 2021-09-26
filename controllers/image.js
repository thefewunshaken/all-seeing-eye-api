const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const stub = ClarifaiStub.grpc();
// This will be used by every Clarifai endpoint call.
const metadata = new grpc.Metadata();
metadata.set('authorization', `Key ${CLARIFAI_API_KEY}`);

module.exports = function() {
   return {
      imageData: function (req, res) {
         const imageUrl = req.body.url;
       
         stub.PostWorkflowResults(
           {
             workflow_id: "Demographics",
             inputs: [
                 {data: {image: {url: imageUrl}}}
             ]
           },
           metadata,
           (err, response) => {
            if (err) {
            throw new Error(err);
            }
      
            if (response.status.code !== 10000) {
            throw new Error("Post workflow results failed, status: " + response.status.description);
            }
      
            // We'll get one WorkflowResult for each input we used above. Because of one input, we have here
            // one WorkflowResult.
            const results = response.results[0];
            const data = [];
      
            for (const output of results.outputs) {
            const model = output.model;
      
            data.push({
               model: {
                  name: model.name,
                  id: model.id,
                  status: model.model_version.status
               },
               data: output.data
            });
            }
       
            return res.status(200).json(data);
           }
         );
      }
   }
}
