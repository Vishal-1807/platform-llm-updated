import axios from "axios";
import { LLMAPI as API, default as LegacyAPI } from "../Api";
export const getLLMProjectsList = async () => {
  return await API.post(`projects`);
};

export const getLLMProjectDetails = async (project_id) => {
  return await API.post(`projects`).then((res) => {
    res.data = res.data.filter((project) => project.proj_id === project_id)[0];
    return res;
  });
};

export const Get_Models = async () => {
  return await LegacyAPI.get(`/cibi/llm/get_models`, {});
};

export const CreateNewLLMProject = async (project, description) => {
  return await API.post(
    `/create_project`,
    { project_name: project, description: description },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetListExperiments = async (project_id = "", exp_id = "") => {
  return await API.post(
    `/experiments`,
    { project_id: project_id, experiment_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetIngressURL = async (exp_id = "") => {
  return await API.post(
    `/ingress`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const Models = async (modeltype) => {
  return await API.post(
    `/models?model_type=hugging-face`,
    { model_type: modeltype },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetDeploymentStatus = async (url = "") => {
  const deploymentStatusURL = axios.create({
    baseURL: url,
  });
  return await deploymentStatusURL.get(`/docs`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const CreateExperiment = async (project_id, expName) => {
  return await API.post(
    `/create_exp`,
    { project_id: project_id, experiment_name: expName },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const data_signed_url = async (filename, experimentId) => {
  return await API.post(
    `/data_signed_url?exp_id=${experimentId}&filename=${filename}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );
};

export const UploadFileTos3 = async (file, exp_id, uploadFilePage) => {
  try {
    let urlRes;
    if (uploadFilePage === "PreparePage") {
      urlRes = await API.post(
        `/data_signed_url?filename=${file.name}&exp_id=${exp_id}`,
        {}
      );
      if (urlRes.status === 200) {
        return {
          s3Res: await fetch(urlRes.data, { method: "PUT", body: file }),
          getUrlRes: urlRes,
        };
      } else {
        return "Error";
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const GetDataPreview = async (exp_id, prompt) => {
  return await API.post(
    `/data_preview`,
    {
      exp_id: exp_id,
      prompt: prompt,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const ingress = async (projectId) => {
  return await API.post(`/ingress?project_id=${projectId}`, {});
};

export const InferData = async (ingressUrl, system_prompt, user_prompt) => {
  return await API.post(
    `${ingressUrl}`,
    { system_prompt: system_prompt, user_prompt: user_prompt },
    {
      headers: {
        "deploy-token": "2BbnYbxrSSmR7Rn4ktGVuwLITsBQeFWXYuXo8XZNen0",
      },
    }
  );
};

export const UpdateConfig = async (exp_id, configType, formData) => {
  return await API.post(
    `/update_config?exp_id=${exp_id}&config_type=${configType}`,
    formData,
    {}
  );
};

export const Train = async (exp_id) => {
  return await API.post(
    `/train`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const TrainTokenizer = async (exp_id) => {
  return await API.post(
    `/train_tokenizer`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const StopTraining = async (exp_id) => {
  return await API.post(
    `/stop_training`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const Deploy = async (exp_id, Replicas, Downscale_delay) => {
  return await API.post(
    `/deploy`,
    {
      exp_ids: exp_id,
      replicas: 1,
      downscale_delay: 1800,
      streaming_enabled: true,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

// export const Deploy = async (exp_id) => {
//   return await API.post(
//     `/deploy`,
//     { exp_id: exp_id },
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     }
//   );
// };

export const Ingress = async (exp_id) => {
  return await API.post(
    `/ingress`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const Deployments = async (exp_id) => {
  return await API.post(`/deployments`, {});
};

export const DeployModel = async (exp_id) => {
  return await API.post(
    `/deploy`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const DeployloadTest = async (exp_id) => {
  return await API.post(
    `/loadtest`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetTrainStatus = async (exp_id) => {
  return await API.get(`/training_status?exp_id=${exp_id}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const GetInfraStatus = async (exp_id) => {
  return await API.get(`/infra_status?exp_id=${exp_id}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const UpdateExp = async (exp_id, status) => {
  return await API.post(
    `/update_exp`,
    { exp_id: exp_id, status: status },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GetExpDataSet = async (exp_id) => {
  return await API.get(
    `/cibi/connectors/get_dataset_for_experiment?exp_id=${exp_id}`,
    {}
  );
};

export const GetRefreshToken = async (old_token) => {
  return await API.post(`/extend_token?old_token=${old_token} `, {});
};

export const GetFeatureImportance = async (exp_id) => {
  return await API.get(`/feature_importance?exp_id=${exp_id}`, {});
};

export const GetCmpr = async (exp_id) => {
  return await API.get(`/cmpr?exp_id=${exp_id}`, {});
};

export const GetBatchStatus = async (exp_id) => {
  return await API.get(`/batch_status?exp_id=${exp_id}`, {});
};

export const GetEndPointStatus = async (exp_id) => {
  return await API.post(
    `/sample_request`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const GenerateDeployToken = async () => {
  return await API.post(`/deployment_token`, {});
};

export const Preprocess = async (exp_id) => {
  return await API.post(
    `/preprocess`,
    { exp_id: exp_id },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
// Connectors
export const GetAllConnectors = async () => {
  return await API.get(`/cibi/connectors/getAllConnectors`, {});
};

export const GetSourcesforConnector = async (source) => {
  return await API.get(
    `/cibi/connectors/getSourcesforConnector?source=${source}`,
    {}
  );
};

export const GetSourceFields = async (source) => {
  return await API.get(`/cibi/connectors/getSourceFields?source=${source}`, {});
};

export const VerifyDataSource = async (exp_id, request) => {
  return await API.post(
    `/cibi/connectors/verifyDataSource?exp_id=${exp_id}`,
    {
      datasourcename: request.datasourcename,
      datasource: request.datasource,
      connection_data: request.connection_data,
    },
    {}
  );
};

export const ExecuteQuery = async (dataSourceModel, Queryvalue) => {
  return await API.post(
    `/cibi/connectors/executeQuery`,
    {
      dataSourceModel: {
        datasourcename: dataSourceModel.datasourcename,
        datasource: dataSourceModel.datasource,
        connection_data: dataSourceModel.connection_data,
      },
      query: Queryvalue,
      uuid: "",
      // user_id: "string",
      // exp_id: "string",
    },
    {}
  );
};

export const SaveQuery = async (dataSourceModel, Queryvalue, exp_id) => {
  return await API.post(
    `/cibi/connectors/saveQuery`,
    {
      dataSourceModel: {
        datasourcename: dataSourceModel.datasourcename,
        datasource: dataSourceModel.datasource,
        connection_data: dataSourceModel.connection_data,
      },
      query: Queryvalue,
      uuid: "",
      // user_id: "string",
      exp_id: exp_id,
    },
    {}
  );
};

export const ExportData = async (exp_id) => {
  return await API.post(`/cibi/connectors/exportData?exp_id=${exp_id}`, {});
};

export const GetMispredictionTree = async (exp_id) => {
  return await API.get(`/misprediction_tree?exp_id=${exp_id}`, {});
};

// ----------------------------shift left-------------------------------------------

export const GetRawFeatureStatus = async (exp_id) => {
  return await API.post(
    `/preprocess/raw_feature_metadata`,
    { exp_id: exp_id },
    {}
  );
};

export const GetRawFeatureData = async (exp_id) => {
  return await API.get(`/preprocess/raw_features/${exp_id}`, {});
};

export const GetEnggFeatureStatus = async (exp_id) => {
  return await API.post(`/preprocess/engg_features`, { exp_id: exp_id }, {});
};

export const GetEnggFeatureData = async (exp_id) => {
  return await API.get(`/expert_features/${exp_id}`, {});
};

export const UserModifiedData = async (exp_id, modifiedData) => {
  return await API.post(
    `/preprocess/user_mod_raw_feature_metadata?exp_id=${exp_id}`,
    {
      raw_features: modifiedData,
    },
    {}
  );
};

export const GetHistoricalQueries = async (exp_id) => {
  return await API.post(
    `/preprocess/relevant_historical_queries`,
    { exp_id: exp_id },
    {}
  );
};

export const FetchSqlQueries = async (exp_id) => {
  return await API.get(`/preprocess/fetch_sql_queries/${exp_id}`, {});
};

// Call populate SQL Editor
export const PopulateSQLStatus = async (exp_id) => {
  return await API.post(`/preprocess/sql_code_gen`, { exp_id: exp_id }, {});
};

// Get Generated Sql
export const GetGeneratedSQL = async (exp_id) => {
  return await API.get(`/preprocess/sql_code_to_autopopulate/${exp_id}`, {});
};

export const GetSqlAssist = async (exp_id, query) => {
  return await API.post(
    `/preprocess/sql_assist`,
    { exp_id: exp_id, query: query },
    {}
  );
};

export const FetchSqlAssist = async (exp_id) => {
  return await API.get(`/preprocess/fetch_sql_assist/${exp_id}`, {});
};

// Write S3 Uris
export const WriteS3Uris = async (
  hostname,
  metadata_uri,
  historical_queries_uri,
  db_type,
  db_name
) => {
  return await API.post(
    `/preprocess/dwh_s3_uris?hostname=${hostname}&db_name=${db_name}&metadata_uri=${metadata_uri}&historical_queries_uri=${historical_queries_uri}&db_type=${db_type}`,
    {}
  );
};
// Call Indexing
export const CallIndexing = async (hostname, db_name) => {
  return await API.post(
    `/preprocess/indexing?hostname=${hostname}&db_name=${db_name}`,
    {}
  );
};

// Get Indexing Status
export const GetIndexing = async (hostname, db_name) => {
  return await API.get(
    `/preprocess/indexing_status?hostname=${hostname}&db_name=${db_name}`,
    {}
  );
};

// ------------------------------data quality-------------------------------

export const GetAnomaliesPct = async (exp_id) => {
  return await API.get(`/anomaly_pct/${exp_id}`, {});
};
