import Card from "../../../components/bootstrap/Card.jsx";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BreadcrumbsElement from "../../../components/BreadcrumbsElement.jsx";
import BreadcrumbsRoot from "../../../components/BreadcrumpsRoot.jsx";
import UserLoginRequired from "../../../components/UserLoginRequired.jsx";
import {AdminHeader} from "../../../components/AdminHeader.jsx";
import {useForm} from "react-hook-form";
import useCachedGetAPI from "../../../hooks/useGetAPI.js";
import {useTranslation} from 'react-i18next';
import {axiosInstance} from "../../../utils/settings.js";

export const AdminProblemsEdit = () => {
    const {probcompId} = useParams()
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [competitionsProblem, updateData] = useCachedGetAPI(`/api/competitionsProblems/${probcompId}`, () => {
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm();

    useEffect(() => {
        updateData()
    }, []);

    useEffect(() => {
        reset({
            priority: competitionsProblem.priority,
            slug: competitionsProblem.slug
        })
    }, [competitionsProblem]);

    const onSubmit = (data) => {
        console.debug(data);

        axiosInstance.patch(`/api/competitionsProblems/${probcompId}`, data)
            .then(() => navigate("/admin/champs"))


    };

    return (
        <>
            <UserLoginRequired/>

            <BreadcrumbsRoot>
                <BreadcrumbsElement name={t('adminChamps.createCompetition')}/>
            </BreadcrumbsRoot>

            <AdminHeader/>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="container mt-4">
                    <div className="mb-3">
                        <label className="form-label">{t('adminProblems.problemSlug')}</label>
                        <input
                            type="text"
                            className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                            {...register("slug", {required: t('adminChamps.problemSlugRequired')})}
                        />
                        {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('adminChamps.priority')}</label>
                        <input
                            type="number"
                            className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                            {...register("priority", {
                                required: t('adminChamps.priorityRequired'),
                                valueAsNumber: true,
                                min: {value: 0, message: t('adminProblems.min0')}
                            })}
                        />
                        {errors.priority && <div className="invalid-feedback">{errors.priority.message}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {t('adminChamps.save')}
                    </button>
                </form>
            </Card>
        </>
    );
};
