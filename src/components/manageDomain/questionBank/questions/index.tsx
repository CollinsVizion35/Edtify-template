import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useStyles from "./styles";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import dynamic from "next/dynamic";

import { BasePageProps, QuestionInt, QuestionsInt } from "@src/utils/interface";
import { queryClient, request } from "@src/utils";
import { useRouter } from "next/router";
import Accordion from "@src/components/shared/accordion";
import { useState } from "react";
import Breadcrumbs from "@src/components/shared/breadcrumbs";
import { useQuery } from "react-query";

const fetchQuestions = async ({ queryKey }: { queryKey: Array<any> }) => {
  const [, centreId, questionBankId] = queryKey;
  const { data } = await request.get({
    url: `/centre/${centreId}/question-bank/${questionBankId}/questions`,
  });
  return data.questions;
};
const QuestionsPage = () => {
  const styles = useStyles();
  const router = useRouter();
  const { id: questionBankId } = router.query;
  const { pageData, cachedData } = queryClient.getQueryData(
    "pageProps"
  ) as BasePageProps;
  const { questionBank } = pageData as {
    questionBank: {
      name: string;
      description: string;
    };
  };

  const { data, refetch } = useQuery(
    ["questions", cachedData.centre.id, questionBankId],
    fetchQuestions,
    {
      initialData: pageData.questions,
    }
  );
  const questions = data as QuestionsInt[];
  const Empty = dynamic(() => import("@src/components/shared/state/Empty"));
  const Menu = dynamic(() => import("./questionBankMenu"));
  const QuestionMenu = dynamic(() => import("./questionMenu"));
  const Image = dynamic(() => import("@src/components/shared/image"));
  const [expanded, setExpanded] = useState(0);
  const links = [
    { link: "/admin", name: "Dashboard" },
    { link: "/admin/exam", name: "Exams" },
    { link: "/admin/question-bank", name: "Question bank" },
  ];

  const getQuestionTypeData = (question: QuestionInt) => {
    if (question.type === "objective" || question.type === "multichoice") {
      return (
        <>
          {question?.options?.map(({ value, isCorrect, image }, index) => (
            <Box
              key={`${index}-option`}
              sx={{ mb: 3 }}
              className={`${isCorrect ? styles.selected : styles.optionStyle}`}
            >
              <Typography
                variant="body1"
                component="div"
                sx={{ color: isCorrect ? "#fff" : "" }}
                dangerouslySetInnerHTML={{ __html: value }}
              />
              {image && (
                <Box sx={{ width: 500, mt: 3 }}>
                  <Image
                    src={image}
                    alt="question image"
                    height="100%"
                    width="100%"
                    layout="responsive"
                  />
                </Box>
              )}
            </Box>
          ))}
        </>
      );
    } else if (question.type === "boolean") {
      return (
        <>
          <Typography
            variant="body1"
            className={`${styles.booleanOptionStyle} ${
              question.answer === true ? styles.booleanOptionSelected : ""
            }`}
          >
            True
          </Typography>
          <Typography
            sx={{ mt: 3 }}
            variant="body1"
            className={`${styles.booleanOptionStyle} ${
              question.answer === false ? styles.booleanOptionSelected : ""
            }`}
          >
            False
          </Typography>
        </>
      );
    } else if (question.type === "range") {
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Expected Answer</Typography>
          <Typography variant="body1">
            <strong>Min</strong>: {question.min}
          </Typography>
          <Typography variant="body1">
            <strong>Max</strong>:{question.max}
          </Typography>
        </Stack>
      );
    }
  };

  return (
    <Box mt={4}>
      <Breadcrumbs
        links={links}
        currentPage={{
          name: "Questions",
          link: `/admin/question-bank/${questionBankId}/questions`,
        }}
      />
      <Typography
        variant="h5"
        component="div"
        sx={{ mt: 4, textTransform: "uppercase", mb: 1 }}
      >
        {questionBank.name}
      </Typography>
      <Typography
        variant="subtitle1"
        component="div"
        dangerouslySetInnerHTML={{ __html: questionBank.description }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: { xs: 5 },
          mb: 5,
        }}
      >
        <Menu
          id={questionBankId as string}
          centreId={cachedData.centre.id}
          refetch={refetch}
        />
      </Box>
      {questions.length ? (
        <Box>
          {questions?.map(({ question, solution }, questionIndex) => (
            <Stack
              direction="row"
              spacing={5}
              key={`${questionIndex}-module`}
              mb={4}
            >
              <Accordion
                sx={{ width: "100%" }}
                onClick={() => setExpanded(questionIndex)}
                title={
                  <div style={{ width: "100%" }}>
                    <Typography
                      component="div"
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Avatar>{questionIndex + 1}</Avatar>
                    </Typography>
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: question.question,
                      }}
                      variant="h5"
                      component="div"
                    />
                    {question.image && (
                      <Box sx={{ width: 500 }}>
                        <Image
                          src={question.image}
                          alt="question image"
                          height="100%"
                          width="100%"
                          layout="responsive"
                        />
                      </Box>
                    )}
                  </div>
                }
                expanded={expanded === questionIndex}
              >
                <>
                  {getQuestionTypeData(question)}
                  {(solution?.text || solution?.imageUrl) && (
                    <>
                      <Typography
                        sx={{ textDecoration: "underline" }}
                        variant="h6"
                        component="div"
                      >
                        Solution
                      </Typography>
                      {solution.text && (
                        <Typography
                          variant="body1"
                          component="div"
                          dangerouslySetInnerHTML={{ __html: solution.text }}
                        />
                      )}
                      {solution.imageUrl && (
                        <Box sx={{ width: 500 }}>
                          <Image
                            src={solution.imageUrl}
                            alt="question image"
                            height="100%"
                            width="100%"
                            layout="responsive"
                          />
                        </Box>
                      )}
                    </>
                  )}
                  <Typography style={{ textAlign: "right" }}>
                    <QuestionMenu
                      questionBankId={questionBankId as string}
                      centreId={cachedData.centre.id}
                      question={questions[questionIndex]}
                      refetch={refetch}
                    />
                  </Typography>
                </>
              </Accordion>
            </Stack>
          ))}
        </Box>
      ) : (
        <Empty />
      )}{" "}
      {/* 
      const pageCount = pageData.examList.pageCount as number;
const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
router.replace({
  query: { ...router.query, pageId: value },
});
};
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

<Stack py={4} direction="row" justifyContent="center" spacing={2}>
{pageCount > 1 && (
<Pagination
  count={pageCount}
  onChange={handleChange}
  shape="rounded"
  size="large"
/>
)}
</Stack> */}
    </Box>
  );
};

export default QuestionsPage;
